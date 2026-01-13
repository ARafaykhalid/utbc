import { Request, Response } from "express";
import { respond } from "@api/utils";
import { TAuthData } from "@shared/types";
import { OrderModel, RefundModel } from "@api/models";
import { Types } from "mongoose";
import {
  TCancelMyOrderBody,
  TCancelMyOrderParams,
} from "@shared/validations/orders";
import { restoreProduct } from "@api/services/products";
import { logger, stripe } from "@api/lib";

export const CancelOrder = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const { orderId } = req.validated?.params as TCancelMyOrderParams;
  const { reason } = req.validated?.body as TCancelMyOrderBody;

  try {
    const order = await OrderModel.findById(orderId).populate(
      "items.product items.variant"
    );

    if (
      !order ||
      order.user.toString() !== (userId as Types.ObjectId).toString()
    ) {
      return respond(res, "NOT_FOUND", "Order not found");
    }

    if (order.deliveryStatus === "cancelled") {
      return respond(res, "BAD_REQUEST", "Order is already cancelled");
    }

    if (
      order.deliveryStatus === "shipped" ||
      order.deliveryStatus === "delivered"
    ) {
      return respond(
        res,
        "BAD_REQUEST",
        "Order cannot be cancelled after it has been shipped"
      );
    }

    if (order.paymentStatus === "refunded") {
      return respond(res, "BAD_REQUEST", "Order has already been refunded");
    }

    if (order.paymentMethod === "STRIPE" && order.paymentStatus === "paid") {
      order.paymentStatus = "refunded";
      order.deliveryStatus = "cancelled";
      order.canceledBy = userId as Types.ObjectId;
      await stripe.refunds.create({
        payment_intent: order.paymentIntentId,
        reason: "requested_by_customer",
      });

      await RefundModel.create({
        order: order._id,
        user: order.user,
        amount: order.total,
        reason: reason || "User requested order cancellation",
        status: "processed",
      });

      order.paymentStatus = "refunded";
      order.deliveryStatus = "cancelled";
      order.canceledBy = userId as Types.ObjectId;
      await order.save();
      await restoreProduct(order.items);

      return respond(
        res,
        "SUCCESS",
        "Order cancellation requested successfully (refund requested)"
      );
    }

    order.deliveryStatus = "cancelled";
    order.canceledBy = userId as Types.ObjectId;

    if (order.paymentStatus !== "paid") {
      order.paymentStatus = "pending confirmation";
    }
    await order.save();

    try {
      await restoreProduct(order.items);
    } catch (e) {
      logger.error("Restock failed during cancel:", e);
    }

    return respond(res, "SUCCESS", "Order cancelled and items restocked");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to cancel order", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
