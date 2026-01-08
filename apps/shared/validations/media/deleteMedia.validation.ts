import z from "zod";
import { ObjectIdSchema } from "../sub-schema";

export const VDeleteMediaParams = z.object({
  mediaId: ObjectIdSchema,
});

export type TDeleteMediaParams = z.infer<typeof VDeleteMediaParams>;
