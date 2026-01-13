import { Request, Response } from "express";
import { Types } from "mongoose";
import { respond } from "@api/utils";
import { TAuthData } from "@shared/types";
import { ProductModel, ReviewModel } from "@api/models";
import { TUpdateReviewBody, TUpdateReviewParams } from "@shared/validations/reviews";

export const UpdateReview = async (req: Request, res: Response) => {
  const { reviewId, productId } = req.validated?.params as TUpdateReviewParams;
  const { ratings, comment } = req.validated?.body as TUpdateReviewBody;
  const { userId } = req.user as TAuthData;

  try {
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return respond(res, "NOT_FOUND", "Review not found.");
    }

    if (review.from.toString() !== (userId as Types.ObjectId).toString()) {
      return respond(
        res,
        "FORBIDDEN",
        "You are not authorized to update this review."
      );
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      return respond(res, "NOT_FOUND", "Product not found.");
    }

    if (
      review.product.toString() !== productId.toString() &&
      !product.reviews.includes(review._id)
    ) {
      return respond(
        res,
        "BAD_REQUEST",
        "Review does not belong to the specified product."
      );
    }

    if (ratings) review.ratings = ratings;
    if (comment) review.comment = comment;

    if (ratings) {
      const totalRatings = product.ratings.totalRatings;
      const currentAverage = product.ratings.average;
      const newAverage =
        (currentAverage * totalRatings - review.ratings + ratings) /
        totalRatings;
      product.ratings.average = newAverage;
    }

    await review.save();
    await product.save();

    return respond(res, "SUCCESS", "Review updated successfully");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to update review", {
      errors: { message: (error as Error).message },
    });
  }
};
