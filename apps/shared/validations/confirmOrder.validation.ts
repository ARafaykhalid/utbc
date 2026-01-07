import { z } from "zod";
import { ObjectIdSchema } from "./sub-schema";

export const VOrderConfirmation = z
  .object({
    token: z.string("Token is required"),
    orderId: ObjectIdSchema,
  })
  .strict()
  .refine((data: {}) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
    path: ["root"],
  });

export type TOrderConfirmation = z.infer<typeof VOrderConfirmation>;
