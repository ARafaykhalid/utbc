import { z } from "zod";

export const BlockUsersSchema = z
  .object({
    userIds: z
      .array(z.string("User ID is required").min(1, "User ID is required"))
      .min(1, "User ID is required"),
  })
  .strict()
  .refine((data: {}) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
    path: ["root"],
  });

export type TBlockUsers = z.infer<typeof BlockUsersSchema>;
