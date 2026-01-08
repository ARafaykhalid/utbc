import z from "zod";

export const VAddMedia = z.object({
  type: z.enum(["image", "video"]).default("image"),

  alt: z.string().min(1).max(200),

  tags: z.array(z.string().min(1)).max(10).optional(),
});

export type TAddMedia = z.infer<typeof VAddMedia>;
