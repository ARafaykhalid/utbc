import { z } from "zod";
import { ObjectIdSchema } from "../others";

export const VDeleteCategory = z.object({
  categoryId: ObjectIdSchema,
});

export type TDeleteCategory = z.infer<typeof VDeleteCategory>;
