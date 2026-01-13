import { Request, Response } from "express";
import { stripe } from "@api/lib";
import { CartModel, CouponModel, OrderModel, UserModel } from "@api/models";
import { respond, token } from "@api/utils";
import { Types } from "mongoose";
import { TAuthData } from "@shared/types";
import { validateCoupon } from "@api/services/coupons";
import { TCheckout } from "@shared/validations/cart";
import { sendOrderConfirmationEmail } from "@api/emails/";
import { checkProductStock, deStockProduct } from "@api/services/products";
import { CONFIRMATION_EXPIRY_TIME } from "@shared/constants";

const CURRENCY = process.env.CURRENCY || "usd";

export const Checkout = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const { shippingAddress, couponCode, paymentMethod } = req.body as TCheckout;

  try {
    const cart = await CartModel.findOne({ user: userId }).lean();
    if (!cart || !cart.items?.length) {
      return respond(res, "BAD_REQUEST", "Cart is empty");
    }
    const user = await UserModel.findById(userId);
    if (!user?.isEmailVerified) {
      return respond(
        res,
        "BAD_REQUEST",
        "Please verify your email before checkout"
      );
    }

    try {
      await checkProductStock(cart.items);
    } catch (err) {
      return respond(res, "BAD_REQUEST", (err as Error).message);
    }
    // prepare order data
    let coupon = null;
    if (couponCode || couponCode !== "") {
      try {
        coupon = await validateCoupon(cart.subtotal, userId, couponCode);
      } catch (err) {
        return respond(res, "BAD_REQUEST", "Invalid coupon", {
          errors: {
            couponCode: (err as Error).message,
          },
        });
      }

      await CouponModel.updateOne(
        { _id: coupon._id },
        { $push: { usedBy: userId } }
      );
    }

    const shipping = cart.items.length > 0 ? 5.0 : 0;
    const total = Math.max(
      cart.subtotal - (coupon?.discount || 0) + shipping,
      0
    );

    const pm = String(paymentMethod ?? "COD").toUpperCase();
    const isCOD = pm === "COD";

    const order = await OrderModel.create({
      user: userId,
      items: cart.items,
      subtotal: cart.subtotal,
      discount: coupon?.discount || 0,
      shipping,
      total,
      coupon: coupon ? coupon.coupon : "",
      paymentStatus: isCOD ? "pending confirmation" : "pending payment",
      deliveryStatus: "processing",
      paymentMethod: isCOD ? "COD" : "STRIPE",
      shippingAddress,
      reservedUntil: new Date(
        Date.now() + CONFIRMATION_EXPIRY_TIME * 60 * 1000
      ),
    });

    try {
      await deStockProduct(cart.items);
    } catch (err) {
      return respond(res, "BAD_REQUEST", (err as Error).message);
    }

    if (isCOD) {
      try {
        const { hashedToken, rawToken, tokenExpiresAt } = await token();
        await sendOrderConfirmationEmail(order, user.email, "COD", rawToken);
        order.confirmationToken = hashedToken;
        order.confirmationTokenExpiresAt = tokenExpiresAt;

        await order.save();
        await CartModel.deleteOne({ user: order.user });

        return respond(res, "SUCCESS", "Order Confirmation Sent", {
          data: { orderId: order._id, paymentMethod: "COD" },
        });
      } catch (err) {
        return respond(
          res,
          "INTERNAL_SERVER_ERROR",
          "Failed to process COD order",
          {
            errors: { message: (err as Error).message },
          }
        );
      }
    }

    // Non-COD: create Stripe PaymentIntent and return client_secret
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: CURRENCY,
      metadata: {
        orderId: order._id.toString(),
        userId: (userId as Types.ObjectId).toString(),
        coupon: coupon ? coupon.coupon : "",
      },
      description: `Order ${order._id.toString()}`,
    });

    order.paymentIntentId = paymentIntent.id;
    await order.save();
    await CartModel.deleteOne({ user: order.user });

    return respond(res, "SUCCESS", "Checkout initiated", {
      data: {
        orderId: order._id,
        clientSecret: paymentIntent.client_secret ?? undefined,
        paymentMethod: "STRIPE",
      },
    });
  } catch (err) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Checkout failed", {
      errors: { message: (err as Error).message },
    });
  }
};
