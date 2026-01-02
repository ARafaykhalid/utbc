import z from "zod";

export const VCreateCategory = z.object({
  name: z.string().min(2, "Name too short"),
});

export type TCreateCategory = z.infer<typeof VCreateCategory>;