import { ProductVariant } from "@/interfaces";
import { Types } from "mongoose";

export const normalizedProductVariants = (variants: ProductVariant[]) => {
  return variants?.map((variant) => {
    const { sku, price, stock, attributes, media: variantMedia } = variant;

    return {
      sku,
      price,
      stock,
      attributes,
      media: new Types.ObjectId(variantMedia),
    };
  });
};
