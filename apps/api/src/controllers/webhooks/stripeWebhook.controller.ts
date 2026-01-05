import { Request, Response } from "express";
import { stripe } from "@/lib";
import { OrderModel, ProductModel, CartModel, CouponModel } from "@/models";
import mongoose from "mongoose";
import { config } from "@/config";

const endpointSecret = config.STRIPE_WEBHOOK_SECRET!;

export const StripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string | undefined;
  const rawBody = req.body as Buffer;

  if (!sig || !endpointSecret)
    return res.status(400).send("Webhook signature or secret missing");

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(
      "Webhook signature verification failed.",
      (err as Error).message
    );
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  const handlePaymentSucceeded = async (pi: any) => {
    const orderId = pi.metadata?.orderId;
    if (!orderId) return;
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const order = await OrderModel.findById(orderId).session(session);
      if (!order) {
        await session.abortTransaction();
        return;
      }
      if (order.status === "paid") {
        await session.commitTransaction();
        return;
      }

      order.status = "paid";
      order.paymentMethod = pi.payment_method_types?.[0] ?? "card";
      await order.save({ session });

      // reduce stock
      for (const it of order.items) {
        const product = await ProductModel.findById(it.product).session(
          session
        );
        if (!product) continue;
        if (typeof product.stock === "number") {
          product.stock = Math.max((product.stock ?? 0) - it.quantity, 0);
          await product.save({ session });
        }
      }

      // clear cart
      await CartModel.deleteOne({ user: order.user }).session(session);

      // coupon usage update
      if (order.coupon) {
        const coupon = await CouponModel.findOne({
          code: order.coupon,
        }).session(session);
        if (coupon) {
          coupon.usedBy = coupon.usedBy || [];
          if (
            !coupon.usedBy.find(
              (u: any) => u.toString() === order.user.toString()
            )
          ) {
            coupon.usedBy.push(order.user);
          }
          if (coupon.usageLimit && typeof coupon.usageLimit === "number") {
            coupon.usageLimit = Math.max(coupon.usageLimit - 1, 0);
          }
          await coupon.save({ session });
        }
      }

      await session.commitTransaction();

      // optional: send e-mail / push
    } catch (err) {
      await session.abortTransaction();
      console.error("Error in webhook handler:", err);
    } finally {
      session.endSession();
    }
  };

  switch (event.type) {
    case "payment_intent.succeeded":
      await handlePaymentSucceeded(event.data.object);
      break;

    case "payment_intent.payment_failed": {
      const pi = event.data.object;
      const orderId = pi.metadata?.orderId;
      if (orderId)
        await OrderModel.findByIdAndUpdate(orderId, { status: "cancelled" });
      break;
    }

    // add other events you care about
    default:
      break;
  }

  res.json({ received: true });
};
