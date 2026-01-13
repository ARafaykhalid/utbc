import z from "zod";
import { ObjectIdSchema } from "../others";

export const VAddToWishlist = z.object({
  productId: ObjectIdSchema,
});

export type TAddToWishlist = z.infer<typeof VAddToWishlist>;
