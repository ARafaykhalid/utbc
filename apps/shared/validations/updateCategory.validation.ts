import { z } from "zod";

export const VUpdateCategory = z.object({
  name: z.string().min(2).optional(),
});

export type TUpdateCategory = z.infer<typeof VUpdateCategory>;