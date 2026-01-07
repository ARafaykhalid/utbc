import { Schema, model, Types } from "mongoose";
import { CartItemSchema, UserAddressSchema } from "./sub-schemas";
import { IOrder } from "@/interfaces";

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    items: [CartItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    coupon: { type: String, default: "" },
    paymentStatus: {
      type: String,
      enum: [
        "pending confirmation",
        "pending payment",
        "expired",
        "confirmed",
        "paid",
        "refunded",
      ],
      default: "pending payment",
    },
    deliveryStatus: {
      type: String,
      enum: ["processing", "pending", "shipped", "delivered", "cancelled"],
      default: "processing",
    },

    paymentIntentId: { type: String },
    paymentMethod: {
      type: String,
      enum: ["STRIPE", "COD"],
      default: "COD",
    },
    shippingAddress: { type: UserAddressSchema, required: true },
    confirmationToken: { type: String, default: null },
    confirmationTokenExpiresAt: { type: Date, default: null },
    reservedUntil: { type: Date },
    canceledBy: { type: Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export const OrderModel = model<IOrder>("Order", OrderSchema);
