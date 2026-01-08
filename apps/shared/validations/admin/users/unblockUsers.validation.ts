import { z } from "zod";
import { ObjectIdSchema } from "../../sub-schema";

export const VUnblockUsers = z
  .object({
    userIds: z.array(ObjectIdSchema).min(1, "User ID is required"),
  })
  .strict()
  .refine((data: {}) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
    path: ["root"],
  });

export type TUnblockUsers = z.infer<typeof VUnblockUsers>;
