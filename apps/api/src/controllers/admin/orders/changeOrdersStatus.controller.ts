import { Request, Response } from "express";
import { respond } from "@api/utils";
import { OrderModel } from "@api/models";
import { TAuthData } from "@shared/types";

export const ChangeOrdersStatus = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const { orderIds, status } = req.validated?.body as {
    orderIds: string[];
    status: "processing" | "pending" | "shipped" | "delivered" | "cancelled";
  };

  try {
    const orders = await OrderModel.find({ _id: { $in: orderIds } })
      .sort({ createdAt: -1 })
      .select("-paymentIntent.client_secret -paymentIntent.idempotencyKey");

    if (!orders || orders.length === 0) {
      return respond(res, "SUCCESS", "No orders found");
    }

    const sameOrderStatus = orders.every(
      (order) => order.deliveryStatus === orders[0].deliveryStatus
    );

    if (!sameOrderStatus) {
      return respond(
        res,
        "BAD_REQUEST",
        "All orders must have the same current status to change status in bulk"
      );
    }

    for (const order of orders) {
      order.deliveryStatus = status;
      await order.save();
    }

    return respond(res, "SUCCESS", "Orders status changed successfully");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch orders", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
