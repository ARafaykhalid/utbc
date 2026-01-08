import { z } from "zod";
import { ObjectIdSchema } from "../sub-schema";

export const VRemoveFromCart = z.object({
  productId: ObjectIdSchema,
  variantId: ObjectIdSchema.optional(),
});

export type TRemoveFromCart = z.infer<typeof VRemoveFromCart>;
