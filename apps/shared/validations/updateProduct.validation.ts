import { z } from "zod";
import { ObjectIdSchema, ProductVariantSchema } from "./sub-schema";

export const VUpdateProductParams = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product id"),
});

export const VUpdateProductBody = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  slug: z.string().min(3).max(200).optional(),
  price: z.number().min(0),
  discountedPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0),
  variants: z.array(ProductVariantSchema).optional(),

  media: z
    .array(ObjectIdSchema)
    .min(1, "At least one media item is required")
    .max(5, "Maximum 5 media items allowed"),

  category: ObjectIdSchema,
  tags: z.array(z.string().min(1)).optional(),
  isActive: z.boolean().optional(),
});

export type TUpdateProductParams = z.infer<typeof VUpdateProductParams>;
export type TUpdateProductBody = z.infer<typeof VUpdateProductBody>;
