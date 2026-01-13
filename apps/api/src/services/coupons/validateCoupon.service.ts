import { CouponModel } from "@api/models";
import { Types } from "mongoose";

export const validateCoupon = async (
  subtotal: number,
  userId: Types.ObjectId | undefined,
  couponCode?: string
): Promise<{
  _id: Types.ObjectId | null;
  discount: number;
  coupon: any | null;
}> => {
  if (!couponCode) return { _id: null, discount: 0, coupon: null };

  const coupon = await CouponModel.findOne({
    code: couponCode,
    active: true,
  }).lean();

  if (!coupon) throw new Error("Invalid coupon");

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validTill)
    throw new Error("Coupon expired");

  if (coupon.minCartValue && subtotal < coupon.minCartValue)
    throw new Error(`Minimum cart value ${coupon.minCartValue}`);

  if (coupon.usageLimit && coupon.usedBy?.length >= coupon.usageLimit)
    throw new Error("Coupon usage limit reached");

  if (coupon.usedBy?.some((u: any) => u.toString() === userId?.toString()))
    throw new Error("Coupon already used by this user");

  let discount =
    coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;

  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

  return { _id: coupon._id, discount, coupon };
};
