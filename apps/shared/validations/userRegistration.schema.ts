import { z } from "zod";

export const UserRegistrationSchema = z
  .object({
    name: z
      .string("Full name is required")
      .min(2, "Full name must be at least 2 characters"),

    email: z.string("Email is required").email("Invalid email address"),
    password: z
      .string("Password is required")
      .min(6, "Password must be at least 6 characters"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must not exceed 15 digits")
      .optional(),
  })
  .strict()
  .refine((data: {}) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
    path: ["root"],
  });

export type TUserRegistration = z.infer<typeof UserRegistrationSchema>;
