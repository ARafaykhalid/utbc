import z from "zod";
import { ObjectIdSchema } from "../others";

export const VDeleteMediaParams = z.object({
  mediaId: ObjectIdSchema,
});

export type TDeleteMediaParams = z.infer<typeof VDeleteMediaParams>;
