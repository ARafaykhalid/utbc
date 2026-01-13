import { Request, Response } from "express";
import { respond } from "@api/utils";
import { TAuthData } from "@shared/types";
import { ReviewModel, UserModel } from "@api/models";

export const MyReviews = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return respond(res, "NOT_FOUND", "User not found", {
        errors: {
          message: "No user found with the provided ID",
        },
      });
    }
    const reviews = await ReviewModel.find({ from: userId });

    const reviewsExists = reviews;
    if (!reviewsExists) {
      return respond(res, "SUCCESS", "No reviews found", {
        data: { reviews: [] },
      });
    }

    return respond(res, "SUCCESS", "Reviews fetched successfully", {
      data: { reviews },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch reviews", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
