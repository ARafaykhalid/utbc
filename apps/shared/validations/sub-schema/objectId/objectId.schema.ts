import { Types } from "mongoose";
import z from "zod";

export const ObjectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid objectId",
  })
  .transform((val) => new Types.ObjectId(val));

export type TObjectId = z.infer<typeof ObjectIdSchema>;
