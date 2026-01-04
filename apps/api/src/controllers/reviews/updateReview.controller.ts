import { Request, Response } from "express";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { Types } from "mongoose";
import { ProductModel, ReviewModel } from "@/models";
import { TUpdateReviewBody, TUpdateReviewParams } from "@shared/validations";

export const UpdateReview = async (req: Request, res: Response) => {
  const { reviewId } = req.validated?.params as TUpdateReviewParams;
  const { ratings, comment } = req.validated?.body as TUpdateReviewBody;
  const { userId } = req.user as TAuthData;

  try {
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return respond(
        res,
        "NOT_FOUND",
        "Review not found. Cannot delete review."
      );
    }
    if (review.from.toString() !== (userId as Types.ObjectId).toString()) {
      return respond(
        res,
        "FORBIDDEN",
        "You are not authorized to delete this review."
      );
    }

    if (ratings) {
      review.ratings = ratings;
      const product = await ProductModel.findById(review.product);
      if (product) {
        const reviews = await ReviewModel.find({ product: product._id });
        const totalRatings = reviews.length;
        const averageRating =
          reviews.reduce((sum, r) => sum + r.ratings, 0) / totalRatings;
        product.ratings.average = averageRating;
        await product.save();
      }
    }
    if (comment) review.comment = comment;
    await review.save();

    return respond(res, "SUCCESS", "Review updated successfully");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to update review", {
      errors: {
        message: (error as Error).message,
      },
    });
  }
};
