import { OrderModel, RefundModel } from "@api/models";
import { checkProductStock, restoreProduct } from "../products";
import { logger, stripe } from "@api/lib";
import Stripe from "stripe";

export const handlePaymentSucceeded = async (
  paymentIntent: Stripe.PaymentIntent
) => {
  const orderId = paymentIntent.metadata.orderId;
  const order = await OrderModel.findById(orderId).populate(
    "items.product items.variant"
  );

  if (!order) return;

  // Check if reservedUntil expired
  const now = new Date();
  const expired = order.reservedUntil && order.reservedUntil < now;

  if (expired) {
    // Stock check
    try {
      await checkProductStock(order.items);
    } catch (error) {
      // Auto refund: no stock
      await stripe.refunds.create({
        payment_intent: paymentIntent.id,
        reason: "requested_by_customer",
      });

      await RefundModel.create({
        order: order._id,
        user: order.user,
        amount: order.total,
        reason: "Insufficient stock for one or more items in the order",
        status: "processed",
      });

      order.paymentStatus = "refunded";
      order.deliveryStatus = "cancelled";
      await order.save();
      await restoreProduct(order.items);
      logger.info(`Order ${order._id} refunded due to insufficient stock.`);
      return;
    }
  }

  // Finalize order
  order.paymentStatus = "paid";
  order.deliveryStatus = "processing";
  order.reservedUntil = undefined;
  await order.save();
};
