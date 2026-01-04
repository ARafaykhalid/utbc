import z from "zod";

export const VRemoveFromWishlist = z.object({
  slug: z.string().min(1).max(200),
});

export type TRemoveFromWishlist = z.infer<typeof VRemoveFromWishlist>;
