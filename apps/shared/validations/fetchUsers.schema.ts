import { z } from "zod";

export const FetchUsersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => Number(v))
    .refine((v) => !isNaN(v) && v >= 1, {
      message: "page must be a number >= 1",
    })
    .optional(),

  limit: z
    .string()
    .optional()
    .transform((v) => Number(v))
    .refine((v) => !isNaN(v) && v >= 1 && v <= 100, {
      message: "limit must be between 1 and 100",
    })
    .optional(),

  sortBy: z
    .enum(["createdAt", "name", "email", "role"])
    .optional(),

  order: z
    .enum(["asc", "desc"])
    .optional(),

  role: z
    .enum(["admin", "user"])
    .optional(),

  blocked: z
    .enum(["true", "false"])
    .optional(),

  q: z
    .string()
    .min(1, "search query cannot be empty")
    .max(100, "search query too long")
    .optional(),
});
