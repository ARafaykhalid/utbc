import z from "zod";
import { ObjectIdSchema } from "../others";

export const VDeleteProduct = z.object({
  productId: ObjectIdSchema,
});
