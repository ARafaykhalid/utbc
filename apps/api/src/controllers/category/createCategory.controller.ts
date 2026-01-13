import { Request, Response } from "express";
import { TAuthData } from "@shared/types";
import { generateUniqueSlug, respond } from "@api/utils";
import { TCreateCategory } from "@shared/validations/category";
import { CategoryModel } from "@api/models";

export const CreateCategory = async (req: Request, res: Response) => {
  const { name, slug, description } = req.validated?.body as TCreateCategory;
  const { userId } = req.user as TAuthData;
  try {
    let newSlug: string;
    if (slug) {
      const existingCategory = await CategoryModel.findOne({
        slug: slug.trim(),
      });
      if (existingCategory) {
        return respond(res, "BAD_REQUEST", "Category already exists", {
          errors: { slug: "Category with this slug already exists" },
        });
      }
      newSlug = slug;
    } else {
      newSlug = await generateUniqueSlug(name, "Category");
    }

    const newCategory = new CategoryModel({
      name: name,
      slug: newSlug.trim(),
      description: description ? description.trim() : undefined,
      createdBy: userId,
    });
    await newCategory.save();

    return respond(res, "SUCCESS", "Category created successfully", {
      data: { newCategory },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Category creation failed", {
      errors: { message: (error as Error).message },
    });
  }
};
