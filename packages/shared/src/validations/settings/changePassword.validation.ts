import { z } from "zod";

export const VChangePassword = z
  .object({
    oldPassword: z
      .string("Old password is required")
      .min(8, "Old password must be at least 6 characters"),
    newPassword: z
      .string("New password is required")
      .min(8, "New password must be at least 6 characters"),
  })
  .strict()
  .refine((data: {}) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
    path: ["root"],
  });

export type TChangePassword = z.infer<typeof VChangePassword>;
