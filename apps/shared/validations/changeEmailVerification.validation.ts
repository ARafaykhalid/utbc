import { z } from "zod";

export const VChangeEmailVerification = z
  .object({
    email: z.string("Email is required").email("Invalid email address"),
    newEmail: z
      .string("New email is required")
      .email("Invalid new email address"),
    token: z.string("Token is required"),
  })
  .strict()
  .refine((data: {}) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
    path: ["root"],
  });

export type TChangeEmailVerification = z.infer<typeof VChangeEmailVerification>;
