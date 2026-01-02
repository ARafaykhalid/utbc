import { z } from "zod";
import { VCreateProduct } from "./createProduct.validation";
import { ObjectIdSchema } from "./sub-schema";

export const VUpdateProduct = VCreateProduct.partial();
export type TUpdateProduct = z.infer<typeof VUpdateProduct>;

export const VUpdateProductParam = z.object({
  productId: ObjectIdSchema,
});

export type TUpdateProductParam = z.infer<typeof VUpdateProductParam>;
