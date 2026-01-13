import z from "zod";
import { ObjectIdSchema } from "../others";

export const VRemoveFromWishlist = z.object({
  productId: ObjectIdSchema,
});

export type TRemoveFromWishlist = z.infer<typeof VRemoveFromWishlist>;
