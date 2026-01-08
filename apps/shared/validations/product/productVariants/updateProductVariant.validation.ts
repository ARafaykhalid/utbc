import { z } from "zod";
import { ObjectIdSchema } from "../../sub-schema";
import { VCreateProductVariantBody } from "./createProductVariant.validation";

export const VUpdateProductVariantBody = VCreateProductVariantBody.partial();

export const VUpdateProductVariantParams = z.object({
  productId: ObjectIdSchema,
  variantId: ObjectIdSchema,
});

export type TUpdateProductVariantBody = z.infer<
  typeof VUpdateProductVariantBody
>;
export type TUpdateProductVariantParams = z.infer<
  typeof VUpdateProductVariantParams
>;
