import { Schema, model, Types } from "mongoose";

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    discountType: {
      type: String,
      enum: ["fixed", "percentage"],
      required: true,
    },
    discountValue: { type: Number, required: true },
    maxDiscount: { type: Number },
    minCartValue: { type: Number, default: 0 },
    usageLimit: { type: Number },
    usedBy: [{ type: Types.ObjectId, ref: "User" }],
    validFrom: { type: Date, required: true },
    validTill: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CouponModel = model("Coupon", CouponSchema);
