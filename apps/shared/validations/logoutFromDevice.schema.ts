import { z } from "zod";

export const LogoutFromDevice = z
  .object({
    sessionId: z
      .string("Object Id for device is required")
      .min(1, "Object Id for device is required"),
  })
  .strict()
  .refine((data: {}) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
    path: ["root"],
  });

export type LogoutFromDevice = z.infer<typeof LogoutFromDevice>;
