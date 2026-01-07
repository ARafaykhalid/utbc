import { IRefund } from "@/interfaces";
import { Schema, model, Types } from "mongoose";

const RefundSchema = new Schema<IRefund>(
  {
    order: { type: Types.ObjectId, ref: "Order", required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    reason: { type: String },
    status: {
      type: String,
      enum: ["requested", "processed", "failed"],
      default: "requested",
    },
    paymentProviderRefundId: { type: String },
  },
  { timestamps: true }
);

export const RefundModel = model<IRefund>("Refund", RefundSchema);
