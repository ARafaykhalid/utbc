import { z } from "zod";

export const VForgotPassword = z
  .object({
    email: z.string("Email is required").email("Invalid email address"),
  })
  .strict()
  .refine((data: {}) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
    path: ["root"],
  });

export type TForgotPassword = z.infer<typeof VForgotPassword>;
