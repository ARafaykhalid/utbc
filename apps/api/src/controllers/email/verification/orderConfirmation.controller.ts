import { Request, Response } from "express";
import { OrderModel } from "@api/models";
import { hashToken, respond } from "@api/utils";
import { deStockProduct } from "@api/services/products";
import { TOrderConfirmationVerification } from "@shared/validations/email/verification";

export const OrderConfirmation = async (req: Request, res: Response) => {
  const { token, orderId } = req.validated
    ?.body as TOrderConfirmationVerification;

  try {
    const hashed = hashToken(token);
    const order = await OrderModel.findOne({
      _id: orderId,
      confirmationToken: hashed,
      confirmationTokenExpiresAt: { $gt: new Date() },
    });
    if (!order) {
      return respond(res, "VALIDATION_ERROR", "Invalid or expired token", {
        errors: { "body.token": "Invalid or expired token" },
      });
    }
    if (order.paymentMethod !== "COD") {
      return respond(
        res,
        "BAD_REQUEST",
        "Only COD orders can be confirmed with this endpoint"
      );
    }

    try {
      await deStockProduct(order.items);
    } catch (err) {
      return respond(
        res,
        "INTERNAL_SERVER_ERROR",
        "Failed to update product stock",
        {
          errors: { message: (err as Error).message },
        }
      );
    }

    order.paymentStatus = "confirmed";
    order.confirmationToken = null;
    order.confirmationTokenExpiresAt = null;
    await order.save();

    return respond(res, "SUCCESS", "COD order confirmed successfully.");
  } catch (error) {
    return respond(
      res,
      "INTERNAL_SERVER_ERROR",
      "Failed to confirm COD order",
      {
        errors: { message: (error as Error).message || "Unknown error" },
      }
    );
  }
};
