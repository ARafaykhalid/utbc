import { Request, Response } from "express";
import { respond } from "@api/utils";
import { TDeleteCategory } from "@shared/validations/category";
import { CategoryModel } from "@api/models";

export const DeleteCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.validated?.params as TDeleteCategory;

  try {
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return respond(res, "NOT_FOUND", "Category not found");
    }
    await category.deleteOne();

    return respond(res, "SUCCESS", "Category deleted successfully");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Category delete failed", {
      errors: { message: (error as Error).message },
    });
  }
};
