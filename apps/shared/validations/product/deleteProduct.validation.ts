import z from "zod";
import { ObjectIdSchema } from "../sub-schema";

export const VDeleteProduct = z.object({
  productId: ObjectIdSchema,
});
