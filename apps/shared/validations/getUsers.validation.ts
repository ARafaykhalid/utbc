import { z } from "zod";

export const VGetUsers = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  sortBy: z
    .enum(["createdAt", "name", "email", "role"])
    .default("createdAt")
    .optional(),

  order: z
    .enum(["asc", "desc"])
    .default("desc")
    .transform((val) => (val === "asc" ? 1 : -1))
    .optional(),

  role: z.string().optional(),

  blocked: z
    .enum(["true", "false"])
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined
    ),

  search: z.string().min(1).optional(),
});

export type TGetUsers = z.infer<typeof VGetUsers>;
