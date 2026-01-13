import { CategoryModel, ProductModel, ProductVariantModel } from "@api/models";
import slugify from "slugify";

export const generateUniqueSlug = async (
  title: string,
  type: "Category" | "Product" | "ProductVariant"
) => {
  const base = slugify(title, { lower: true, strict: true }).slice(0, 200);
  let slug = base;
  let i = 0;
  while (
    await (type === "Category"
      ? CategoryModel.exists({ slug })
      : type === "Product"
      ? ProductModel.exists({ slug })
      : type === "ProductVariant"
      ? ProductVariantModel.exists({ slug })
      : false)
  ) {
    i += 1;
    slug = `${base}-${i}`;
    if (i > 1000) throw new Error("Unable to generate unique slug");
  }
  return slug;
};
