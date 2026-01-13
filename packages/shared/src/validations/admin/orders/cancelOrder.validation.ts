import { ObjectIdSchema } from "../../others";
import { z } from "zod";

export const VCancelOrderParams = z.object({
  orderId: ObjectIdSchema,
});
export const VCancelOrderBody = z.object({
  reason: z.string().max(500).optional(),
});

export type TCancelOrderParams = z.infer<typeof VCancelOrderParams>;
export type TCancelOrderBody = z.infer<typeof VCancelOrderBody>;
