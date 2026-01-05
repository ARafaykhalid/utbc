import { z } from "zod";
import { VCreateProduct } from "./createProduct.validation";
import { ObjectIdSchema } from "./sub-schema";

export const VUpdateProductParams = z.object({
  productId: ObjectIdSchema,
});

export const VUpdateProductBody = VCreateProduct.partial();

export type TUpdateProductParams = z.infer<typeof VUpdateProductParams>;
export type TUpdateProductBody = z.infer<typeof VUpdateProductBody>;
