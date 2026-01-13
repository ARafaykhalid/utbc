import { z } from "zod";

export const VUserLogin = z
  .object({
    email: z.string("Email is required").email("Invalid email address"),
    password: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters"),
  })
  .strict()
  .refine((data: {}) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
    path: ["root"],
  });

export type TUserLogin = z.infer<typeof VUserLogin>;
