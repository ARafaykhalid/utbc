import { z } from "zod";
import { ObjectIdSchema } from "./sub-schema";

export const VDeleteReview = z.object({
  reviewId: ObjectIdSchema,
  productId: ObjectIdSchema,
});

export type TDeleteReview = z.infer<typeof VDeleteReview>;
