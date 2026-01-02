import { z } from "zod";
import { VCreateProduct } from "./createProduct.validation";
import { ObjectIdSchema } from "./sub-schema";

export const VUpdateProduct = VCreateProduct.partial();

export const VUpdateProductParam = z.object({
  productId: ObjectIdSchema,
});

export type TUpdateProduct = z.infer<typeof VUpdateProduct>;
export type TUpdateProductParam = z.infer<typeof VUpdateProductParam>;
