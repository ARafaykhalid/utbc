import z from "zod";
import { ObjectIdSchema } from "../others";

export const VUpdateMediaParams = z.object({
  mediaId: ObjectIdSchema,
});

export const VUpdateMediaBody = z.object({
  alt: z.string().min(1).max(200).optional(),
  tags: z.array(z.string().min(1)).max(10).optional(),
});

export type TUpdateMediaParams = z.infer<typeof VUpdateMediaParams>;
export type TUpdateMediaBody = z.infer<typeof VUpdateMediaBody>;
