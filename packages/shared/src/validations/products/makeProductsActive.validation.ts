import { z } from "zod";
import { ObjectIdSchema } from "../others";

export const VMakeProductsActive = z.object({
  productIds: z
    .array(ObjectIdSchema)
    .min(1, "At least one product ID is required"),
});

export type TMakeProductsActive = z.infer<typeof VMakeProductsActive>;
