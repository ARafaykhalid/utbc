import { Request, Response } from "express";
import { logger, stripe } from "@/lib";
import { OrderModel, ProductModel, CartModel, CouponModel } from "@/models";
import mongoose from "mongoose";
import { config } from "@/config";
import { respond } from "@/utils";
import { handlePaymentSucceeded } from "@/services/webhook/paymentSucceed.service";
import { restoreProduct } from "@/services/products";

const endpointSecret = config.STRIPE_WEBHOOK_SECRET!;

export const StripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string | undefined;
  const rawBody = req.body as Buffer;

  if (!sig || !endpointSecret)
    return respond(res, "BAD_REQUEST", "Missing signature or endpoint secret");

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    return respond(
      res,
      "BAD_REQUEST",
      "Webhook signature verification failed",
      { errors: { message: (err as Error).message } }
    );
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      await handlePaymentSucceeded(event.data.object);
      break;

    case "payment_intent.payment_failed": {
      const pi = event.data.object;
      const orderId = pi.metadata?.orderId;
      if (!orderId) break;

      const order = await OrderModel.findById(orderId);
      if (!order) break;

      // Only cancel if not already paid/refunded
      if (
        order.paymentStatus !== "paid" &&
        order.paymentStatus !== "refunded"
      ) {
        order.deliveryStatus = "cancelled";
        await order.save();

        try {
          await restoreProduct(order.items);
        } catch (err) {
          logger.error(
            `[StripeWebhook] Failed to restore stock for order ${orderId}:`,
            err
          );
        }
      }
      break;
    }

    default:
      break;
  }

  res.json({ received: true });
};
