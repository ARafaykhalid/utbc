import { z } from "zod";
import { ObjectIdSchema } from "../sub-schema";

export const VCancelMyOrderParams = z.object({
  orderId: ObjectIdSchema,
});
export const VCancelMyOrderBody = z.object({
  reason: z.string().max(500).optional(),
});

export type TCancelMyOrderParams = z.infer<typeof VCancelMyOrderParams>;
export type TCancelMyOrderBody = z.infer<typeof VCancelMyOrderBody>;
