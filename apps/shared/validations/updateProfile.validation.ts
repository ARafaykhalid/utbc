import { z } from "zod";
import { UserAddressSchema } from "./sub-schema";

export const VUpdateProfile = UserAddressSchema.strict().refine(
  (data: {}) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided for update",
    path: ["root"],
  }
);

export type TUpdateProfile = z.infer<typeof VUpdateProfile>;
