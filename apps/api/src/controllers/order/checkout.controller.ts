import { Request, Response } from "express";
import { stripe } from "@/lib";
import { CartModel, ProductModel, OrderModel, CouponModel } from "@/models";
import { respond } from "@/utils";
import { Types } from "mongoose";
import { TAuthData } from "@shared/types";

const CURRENCY = process.env.CURRENCY || "usd";

export const Checkout = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const { shippingAddress, couponCode } = req.body;

  try {
    const cart = await CartModel.findOne({ user: userId }).lean();
    if (!cart || !cart.items?.length)
      return respond(res, "BAD_REQUEST", "Cart is empty");

    // Build snapshot & validate stock
    const items = [];
    for (const ci of cart.items) {
      const product = await ProductModel.findById(ci.product).lean();
      if (!product || !product.isActive)
        return respond(res, "BAD_REQUEST", "Product not available");
      if (typeof product.stock === "number" && product.stock < ci.quantity)
        return respond(
          res,
          "BAD_REQUEST",
          `Insufficient stock for ${product.title}`
        );

      items.push({
        product: product._id,
        variant: ci.variant ?? null,
        quantity: ci.quantity,
        price: ci.price,
        title: product.title,
        media: ci.media ?? product.media?.[0] ?? "",
      });
    }

    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    let discount = 0;
    let coupon = null;

    if (couponCode) {
      coupon = await CouponModel.findOne({
        code: couponCode,
        active: true,
      }).lean();
      if (!coupon) return respond(res, "BAD_REQUEST", "Invalid coupon");
      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validTill)
        return respond(res, "BAD_REQUEST", "Coupon expired");
      if (coupon.minCartValue && subtotal < coupon.minCartValue)
        return respond(
          res,
          "BAD_REQUEST",
          `Minimum cart value ${coupon.minCartValue}`
        );

      if (coupon.discountType === "percentage") {
        discount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount)
          discount = Math.min(discount, coupon.maxDiscount);
      } else {
        discount = coupon.discountValue;
      }

      if (coupon.usageLimit && coupon.usedBy?.length >= coupon.usageLimit)
        return respond(res, "BAD_REQUEST", "Coupon usage limit reached");
      if (
        coupon.usedBy &&
        coupon.usedBy.find(
          (u: any) => u.toString() === (userId as Types.ObjectId).toString()
        )
      )
        return respond(res, "BAD_REQUEST", "Coupon already used by this user");
    }

    const shipping = 0; // implement shipping calc if needed
    const total = Math.max(subtotal - discount + shipping, 0);

    // create pending order snapshot
    const order = await OrderModel.create({
      user: userId,
      items,
      subtotal,
      discount,
      shipping,
      total,
      coupon: coupon ? coupon.code : "",
      status: "pending",
      shippingAddress,
    });

    // create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: CURRENCY,
      metadata: {
        orderId: order._id.toString(),
        userId: (userId as Types.ObjectId).toString(),
        coupon: coupon ? coupon.code : "",
      },
      description: `Order ${order._id.toString()}`,
      // optionally: receipt_email
    });

    order.paymentIntentId = paymentIntent.id;
    await order.save();

    return respond(res, "SUCCESS", "Checkout initiated", {
      data: { clientSecret: paymentIntent.client_secret, orderId: order._id },
    });
  } catch (err) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Checkout failed", {
      errors: { message: (err as Error).message },
    });
  }
};
