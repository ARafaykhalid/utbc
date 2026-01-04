import { Request, Response } from "express";
import { TAuthData } from "@shared/types";
import { respond } from "@/utils";
import {
  TUpdateCategoryBody,
  TUpdateCategoryParams,
} from "@shared/validations";
import { CategoryModel } from "@/models";
import { Types } from "mongoose";

export const UpdateCategory = async (req: Request, res: Response) => {
  const { name, slug, description } = req.validated
    ?.body as TUpdateCategoryBody;
  const { categoryId } = req.validated?.params as TUpdateCategoryParams;
  const { userId } = req.user as TAuthData;

  try {
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return respond(res, "NOT_FOUND", "Category not found");
    }
    if (name !== undefined) category.name = name;
    if (slug !== undefined) category.slug = slug;
    if (description !== undefined) category.description = description;
    category.updatedBy = userId as Types.ObjectId;

    await category.save();
    return respond(res, "SUCCESS", "Category updated successfully", {
      data: { category },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Category update failed", {
      errors: { message: (error as Error).message },
    });
  }
};
