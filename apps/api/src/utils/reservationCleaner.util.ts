import { logger } from "@api/lib";
import { OrderModel } from "@api/models";
import { restoreProduct } from "@api/services/products";

export const reservationCleaner = () => {
  setInterval(async () => {
    const now = new Date();
    const expiredOrders = await OrderModel.find({
      paymentStatus: "pending confirmation",
      reservedUntil: { $lt: now },
    });

    for (const order of expiredOrders) {
      await restoreProduct(order.items);

      order.paymentStatus = "expired";
      order.deliveryStatus = "cancelled";
      order.reservedUntil = undefined;
      logger.info(`Restored stock for expired order ${order._id}`);
      await order.save();
    }

    const processedOrders = await OrderModel.find({
      paymentStatus: "confirmed",
      deliveryStatus: "processing",
      updatedAt: { $lt: new Date(now.getTime() - 7 * 60 * 60 * 1000) },
    });

    for (const order of processedOrders) {
      order.deliveryStatus = "pending";
      logger.info(`Updated delivery status to pending for order ${order._id}`);
      await order.save();
    }
  }, 5 * 60 * 1000);
};
