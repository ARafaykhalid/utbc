
import { ProductModel } from "@/models";
import slugify from "slugify";

export const generateUniqueSlug = async (title: string) => {
  const base = slugify(title, { lower: true, strict: true }).slice(0, 200);
  let slug = base;
  let i = 0;
  while (await ProductModel.exists({ slug })) {
    i += 1;
    slug = `${base}-${i}`;
    if (i > 1000) throw new Error("Unable to generate unique slug");
  }
  return slug;
};
