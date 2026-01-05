import { Schema, model, Types } from "mongoose";
import { CartItemSchema } from "./sub-schemas";

const OrderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    items: [CartItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    coupon: { type: String, default: "" },
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    paymentIntentId: { type: String },
    paymentMethod: { type: String },
    shippingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
    },
  },
  { timestamps: true }
);

export const OrderModel = model("Order", OrderSchema);
