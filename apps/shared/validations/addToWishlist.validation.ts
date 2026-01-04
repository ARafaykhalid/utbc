import z from "zod";
import { ObjectIdSchema } from "./sub-schema";

export const VAddToWishlist = z.object({
  slug: z.string().min(1).max(200),
});

export type TAddToWishlist = z.infer<typeof VAddToWishlist>;
