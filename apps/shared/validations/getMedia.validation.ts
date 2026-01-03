import z from "zod";

export const VGetMediaQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),

  type: z.enum(["image", "video"]).optional(),

  tag: z.string().optional(),

  sortBy: z.enum(["createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type TGetMediaQuery = z.infer<typeof VGetMediaQuery>;
