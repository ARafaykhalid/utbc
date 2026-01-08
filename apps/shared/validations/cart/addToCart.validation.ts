import { z } from "zod";
import { ObjectIdSchema } from "../sub-schema";

export const VAddToCart = z.object({
  productId: ObjectIdSchema,
  variantId: ObjectIdSchema.optional(),
  quantity: z.coerce.number().int().min(1).default(1),
});

export type TAddToCart = z.infer<typeof VAddToCart>;
