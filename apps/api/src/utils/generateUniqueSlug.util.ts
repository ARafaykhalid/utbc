import { CategoryModel, ProductModel } from "@/models";
import slugify from "slugify";

export const generateUniqueSlug = async (
  title: string,
  type: "Category" | "Product"
) => {
  const base = slugify(title, { lower: true, strict: true }).slice(0, 200);
  let slug = base;
  let i = 0;
  while (
    type === "Category"
      ? await CategoryModel.exists({ slug })
      : await ProductModel.exists({ slug })
  ) {
    i += 1;
    slug = `${base}-${i}`;
    if (i > 1000) throw new Error("Unable to generate unique slug");
  }
  return slug;
};
