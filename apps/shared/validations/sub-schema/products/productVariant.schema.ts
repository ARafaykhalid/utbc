import { z } from "zod";
import { ObjectIdSchema } from "../objectId/objectId.schema";

export const ProductVariantSchema = z.object({
  sku: z.string().min(2),
  price: z.number().min(0),
  stock: z.number().min(0),
  attributes: z
    .object({
      size: z.string().optional(),
      color: z.string().optional(),
      material: z.string().optional(),
    })
    .optional(),
  media: ObjectIdSchema,
});

export type TProductVariant = z.infer<typeof ProductVariantSchema>;
