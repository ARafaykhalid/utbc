import { z } from "zod";
import { ObjectIdSchema } from "./sub-schema";

export const VRevokeSession = z
  .object({
    sessionId: ObjectIdSchema,
  })
  .strict()
  .refine((data: {}) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
    path: ["root"],
  });

export type TRevokeSession = z.infer<typeof VRevokeSession>;
