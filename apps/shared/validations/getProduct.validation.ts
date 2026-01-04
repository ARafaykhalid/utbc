import { z } from "zod";

export const VGetProduct = z.object({
  slug: z.string().min(1).max(200),
});

export type TGetProduct = z.infer<typeof VGetProduct>;
