import { z } from "zod";
import { ObjectIdSchema } from "./sub-schema";

export const VGetCategory = z.object({
  categoryId: ObjectIdSchema,
});

export type TGetCategory = z.infer<typeof VGetCategory>;
