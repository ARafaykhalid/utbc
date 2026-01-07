import { Request, Response } from "express";
import { respond } from "@/utils";
import { OrderModel } from "@/models";
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

    for (const order of orders) {
      order.deliveryStatus = status;
      await order.save();
    }

    if (!orders || orders.length === 0) {
      return respond(res, "SUCCESS", "No orders found");
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
