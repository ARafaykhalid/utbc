import z from "zod";

export const VCreateCategory = z.object({
  name: z.string().min(2, "Name too short"),
  slug: z.string().min(2, "Slug too short").optional(),
  description: z.string().min(10, "Description too short").optional(),
  tags: z.array(z.string().min(1)).optional(),
});

export type TCreateCategory = z.infer<typeof VCreateCategory>;
