import { z } from "zod";

export const ProductRatingSchema = z.object({
  average: z.number().min(0).max(5),
  count: z.number().int().min(0),
});

export type TProductRating = z.infer<typeof ProductRatingSchema>;
