import { z } from "zod";
import {
  ObjectIdSchema,
  ProductImageSchema,
  ProductVariantSchema,
} from "./sub-schema";

export const VCreateProduct = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),

  price: z.coerce.number().min(0),
  discountPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().min(0),

  variants: z
    .array(ProductVariantSchema)
    .min(1)
    .superRefine((variants, ctx) => {
      const skus = variants.map((v) => v.sku);
      const duplicates = skus.filter((sku, i) => skus.indexOf(sku) !== i);

      if (duplicates.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Duplicate SKUs are not allowed",
        });
      }
    }),

  images: z.array(ProductImageSchema).optional(),

  category: ObjectIdSchema,

  tags: z
    .union([z.array(z.string()), z.string().transform((v) => v.split(","))])
    .optional(),

  isActive: z.coerce.boolean().optional(),
});

export type TCreateProduct = z.infer<typeof VCreateProduct>;
