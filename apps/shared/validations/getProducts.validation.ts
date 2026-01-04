import { z } from "zod";

export const VGetProducts = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),

  sortBy: z.enum(["createdAt", "price", "title", "stock"]).optional(),

  order: z
    .enum(["asc", "desc"])
    .default("desc")
    .transform((val) => (val === "asc" ? 1 : -1))
    .optional(),

  search: z.string().min(1).optional(),

  category: z.string().optional(),
  tag: z.string().optional(),

  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),

  bestSelling: z.coerce.boolean().optional(),
  highestRated: z.coerce.boolean().optional(),
  ratings: z.coerce.number().min(1).max(5).optional(),
});

export type TGetProducts = z.infer<typeof VGetProducts>;
