import { z } from "zod";
import { ObjectIdSchema } from "./sub-schema";

export const VCreateProduct = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  slug: z.string().min(3).max(200).optional(),
  price: z.number().min(0),
  discountedPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0),

  media: z
    .array(ObjectIdSchema)
    .min(1, "At least one media item is required")
    .max(5, "Maximum 5 media items allowed"),

  category: ObjectIdSchema,
  tags: z.array(z.string().min(1)).optional(),
  isActive: z.boolean().optional(),
});

export type TCreateProduct = z.infer<typeof VCreateProduct>;
