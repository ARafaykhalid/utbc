import { Request, Response } from "express";
import { respond } from "@/utils";
import { CategoryModel } from "@/models";
import { TGetCategories } from "@shared/validations";

export const getCategories = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    order = -1,
  } = req.validated?.query as TGetCategories;
  try {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;

    // Total count
    const total = await CategoryModel.countDocuments();

    // Fetch categories with pagination and sorting
    const categories = await CategoryModel.find()
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(safeLimit);

    return respond(res, "SUCCESS", "Categories fetched successfully", {
      data: {
        categories,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages: Math.ceil(total / safeLimit),
        },
      },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch categories", {
      errors: { message: (error as Error).message },
    });
  }
};
