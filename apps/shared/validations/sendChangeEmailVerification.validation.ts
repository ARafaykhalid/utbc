import { z } from "zod";

export const VSendChangeEmailVerification = z
  .object({
    newEmail: z
      .string("New email is required")
      .email("Invalid new email address"),
  })
  .strict()
  .refine((data: {}) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
    path: ["root"],
  });

export type TSendChangeEmailVerification = z.infer<
  typeof VSendChangeEmailVerification
>;
