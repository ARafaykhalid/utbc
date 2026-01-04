import { Request, Response } from "express";
import { respond } from "@/utils";
import { ReviewModel } from "@/models";
import { TGetReviews } from "@shared/validations";

export const GetReviews = async (req: Request, res: Response) => {
  const {
    productId,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = -1,
    ratings,
    search,
  } = req.validated?.query as TGetReviews;

  const safePage = Math.max(1, page);
  const safeLimit = Math.min(50, limit);
  const skip = (safePage - 1) * safeLimit;

  const filter: Record<string, any> = {};

  if (productId) {
    filter.product = productId;
  }

  if (ratings) {
    filter.ratings = Number(ratings);
  }

  if (search) {
    filter.comment = { $regex: search, $options: "i" };
  }

  try {
    const [reviews, total] = await Promise.all([
      ReviewModel.find(filter)
        .populate("from", "name _id email")
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(safeLimit)
        .lean(),

      ReviewModel.countDocuments(filter),
    ]);

    return respond(res, "SUCCESS", "Reviews fetched successfully", {
      data: {
        reviews,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages: Math.ceil(total / safeLimit),
        },
      },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch reviews", {
      errors: {
        message: (error as Error).message,
      },
    });
  }
};
