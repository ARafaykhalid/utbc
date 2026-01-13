import { z } from "zod";
import { ObjectIdSchema } from "../../others";

export const VCreateProductVariantBody = z.object({
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

export const VCreateProductVariantParams = z.object({
  productId: ObjectIdSchema,
});

export type TCreateProductVariantParams = z.infer<
  typeof VCreateProductVariantParams
>;
export type TCreateProductVariantBody = z.infer<
  typeof VCreateProductVariantBody
>;
