import z from "zod";
import { ObjectIdSchema } from "./sub-schema";

export const VAddToWishlist = z.object({
  productId: ObjectIdSchema,
});

export type TAddToWishlist = z.infer<typeof VAddToWishlist>;
