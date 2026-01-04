import { Request, Response } from "express";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { ProductModel, ReviewModel } from "@/models";

export const DeleteReview = async (req: Request, res: Response) => {
  const { reviewId } = req.validated?.params;
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
    if (review.from === userId) {
      return respond(
        res,
        "FORBIDDEN",
        "You are not authorized to delete this review."
      );
    }

    const product = await ProductModel.findById(review.product);
    if (!product) {
      return respond(
        res,
        "NOT_FOUND",
        "Associated product not found. Cannot delete review."
      );
    }
    product.reviews = product.reviews.filter(
      (revId) => !revId.equals(review._id)
    );

    // Update ratings
    if (product.ratings.totalRatings > 1) {
      product.ratings.average =
        (product.ratings.average * product.ratings.totalRatings -
          review.ratings) /
        (product.ratings.totalRatings - 1);
      product.ratings.totalRatings -= 1;
    } else {
      product.ratings.average = 0;
      product.ratings.totalRatings = 0;
    }

    await product.save();
    await review.deleteOne();

    return respond(res, "SUCCESS", "Review deleted successfully");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to delete review", {
      errors: {
        message: (error as Error).message,
      },
    });
  }
};
