import { z } from "zod";
import { ObjectIdSchema } from "../others";

export const VUpdateCartItem = z.object({
  productId: ObjectIdSchema,
  variantId: ObjectIdSchema.optional(),
  quantity: z.coerce.number().int().min(1).default(1),
});

export type TUpdateCartItem = z.infer<typeof VUpdateCartItem>;
