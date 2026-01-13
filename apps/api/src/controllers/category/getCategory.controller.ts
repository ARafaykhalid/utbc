import { Request, Response } from "express";
import { respond } from "@api/utils";
import { CategoryModel } from "@api/models";
import { TGetCategory } from "@shared/validations/category";

export const GetCategory = async (req: Request, res: Response) => {
  const { slug } = req.validated?.params as TGetCategory;
  try {
    const category = await CategoryModel.findOne({ slug: slug });
    if (!category) {
      return respond(res, "NOT_FOUND", "Category not found");
    }

    return respond(res, "SUCCESS", "Category fetched successfully", {
      data: {
        category,
      },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch categories", {
      errors: { message: (error as Error).message },
    });
  }
};
