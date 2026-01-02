import { z } from "zod";
import { ObjectIdSchema } from "./sub-schema";

export const VCategoryParam = z.object({
  id: ObjectIdSchema,
});

export type TCategoryParam = z.infer<typeof VCategoryParam>;
