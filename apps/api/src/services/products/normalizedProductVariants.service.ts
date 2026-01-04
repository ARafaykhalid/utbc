import { ProductVariant } from "@/interfaces";
import { Types } from "mongoose";

export const normalizedProductVariants = (
  variants: Partial<ProductVariant>[]
) => {
  return variants?.map((variant) => ({
    sku: variant.sku,
    price: variant.price,
    stock: variant.stock,
    attributes: variant.attributes,
    media: new Types.ObjectId(variant.media),
  }));
};
