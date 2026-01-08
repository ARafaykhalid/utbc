import z from "zod";
import { ObjectIdSchema } from "../sub-schema";

export const VRemoveFromWishlist = z.object({
  productId: ObjectIdSchema,
});

export type TRemoveFromWishlist = z.infer<typeof VRemoveFromWishlist>;
