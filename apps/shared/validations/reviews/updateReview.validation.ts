import { z } from "zod";
import { ObjectIdSchema } from "../sub-schema";

export const VUpdateReviewParams = z.object({
  reviewId: ObjectIdSchema,
  productId: ObjectIdSchema,
});

export const VUpdateReviewBody = z.object({
  ratings: z.number().min(1).max(5).optional(),
  comment: z.string().min(1).max(1000).optional(),
});

export type TUpdateReviewParams = z.infer<typeof VUpdateReviewParams>;
export type TUpdateReviewBody = z.infer<typeof VUpdateReviewBody>;
