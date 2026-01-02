import { z } from "zod";

export const ProductImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
});

export type TProductImage = z.infer<typeof ProductImageSchema>;
