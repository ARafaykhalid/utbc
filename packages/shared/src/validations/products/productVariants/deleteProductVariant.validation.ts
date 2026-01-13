import { z } from "zod";
import { ObjectIdSchema } from "../../others";

export const VDeleteProductVariant = z.object({
  variantId: ObjectIdSchema.optional(),
  productId: ObjectIdSchema.optional(),
});

export type TDeleteProductVariant = z.infer<typeof VDeleteProductVariant>;
