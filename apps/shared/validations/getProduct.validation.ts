import { z } from "zod";
import { ObjectIdSchema } from "./sub-schema";

export const VGetProduct = z.object({
  productId: ObjectIdSchema,
});

export type TGetProduct = z.infer<typeof VGetProduct>;