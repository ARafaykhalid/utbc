import { z } from "zod";

export const VGetCategory = z.object({
  slug: z.string().min(3).max(200),
});

export type TGetCategory = z.infer<typeof VGetCategory>;
