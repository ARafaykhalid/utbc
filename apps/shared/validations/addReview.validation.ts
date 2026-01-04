import { z } from "zod";
import { ObjectIdSchema } from "./sub-schema";

export const VAddReviewParams = z.object({
  productId: ObjectIdSchema,
});

export const VAddReviewBody = z.object({
  ratings: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000).optional(),
});

export type TAddReviewParams = z.infer<typeof VAddReviewParams>;
export type TAddReviewBody = z.infer<typeof VAddReviewBody>;
