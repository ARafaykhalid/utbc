import { z } from "zod";
import { ObjectIdSchema } from "../sub-schema";

export const VUpdateCategoryBody = z.object({
  name: z.string().min(2, "Name too short").optional(),
  slug: z.string().min(2, "Slug too short").optional(),
  tags: z.array(z.string().min(1)).max(10).optional(),
  description: z.string().optional(),
});
export const VUpdateCategoryParams = z.object({
  categoryId: ObjectIdSchema,
});

export type TUpdateCategoryParams = z.infer<typeof VUpdateCategoryParams>;
export type TUpdateCategoryBody = z.infer<typeof VUpdateCategoryBody>;
