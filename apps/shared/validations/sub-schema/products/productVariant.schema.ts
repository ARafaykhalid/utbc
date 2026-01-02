import { z } from "zod";

export const ProductVariantSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .transform((v) => v.toUpperCase()),

  price: z
    .number()
    .min(0, "Price must be >= 0"),

  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock must be >= 0"),

  attributes: z.object({
    size: z.string().optional(),
    color: z.string().optional(),
    material: z.string().optional(),
  }),
});

export type TProductVariant = z.infer<typeof ProductVariantSchema>;