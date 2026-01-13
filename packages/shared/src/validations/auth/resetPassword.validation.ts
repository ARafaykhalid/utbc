import { z } from "zod";

export const VResetPassword = z
  .object({
    email: z.string("Email is required").email("Invalid email address"),
    token: z.string("Token is required"),
    password: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters long"),
  })
  .strict()
  .refine((data: {}) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
    path: ["root"],
  });

export type TResetPassword = z.infer<typeof VResetPassword>;
