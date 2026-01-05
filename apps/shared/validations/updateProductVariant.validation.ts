import { z } from "zod";
import { VCreateProductVariantBody } from "./createProductVariant.validation";
import { ObjectIdSchema } from "./sub-schema";

export const VUpdateProductVariantBody = VCreateProductVariantBody.partial();

export const VUpdateProductVariantParams = z.object({
  productId: ObjectIdSchema,
  variantId: ObjectIdSchema,
});

export type TUpdateProductVariantBody = z.infer<typeof VUpdateProductVariantBody>;
export type TUpdateProductVariantParams = z.infer<typeof VUpdateProductVariantParams>;
