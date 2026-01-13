import { z } from "zod";
import { ObjectIdSchema } from "../others";

export const VGetReviews = z.object({
  productId: ObjectIdSchema.optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),

  sortBy: z.enum(["createdAt", "ratings"]).optional(),

  order: z
    .enum(["asc", "desc"])
    .default("desc")
    .transform((val) => (val === "asc" ? 1 : -1))
    .optional(),

  search: z.string().min(1).optional(),
  ratings: z.coerce.number().min(1).max(5).optional(),
});

export type TGetReviews = z.infer<typeof VGetReviews>;
