import { Request, Response } from "express";
import { respond } from "@api/utils";
import { TAuthData } from "@shared/types";
import { ProductModel, ReviewModel } from "@api/models";
import { TDeleteReview } from "@shared/validations/reviews";
import { Types } from "mongoose";

export const DeleteReview = async (req: Request, res: Response) => {
  const { reviewId, productId } = req.validated?.body as TDeleteReview;
  const { userId } = req.user as TAuthData;

  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return respond(
        res,
        "NOT_FOUND",
        "Product not found. Cannot delete review."
      );
    }
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return respond(res, "NOT_FOUND", "Review not found.");
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
    if (review.from.toString() !== (userId as Types.ObjectId).toString()) {
      return respond(
        res,
        "FORBIDDEN",
        "You are not authorized to delete this review."
      );
    }

    product.ratings.totalRatings = Math.max(
      product.ratings.totalRatings - 1,
      0
    );
    if (product.ratings.totalRatings === 0) {
      product.ratings.average = 0;
    } else {
      product.ratings.average =
        (product.ratings.average * (product.ratings.totalRatings + 1) -
          review.ratings) /
        product.ratings.totalRatings;
    }
    product.reviews = product.reviews.filter(
      (rId) => rId.toString() !== reviewId.toString()
    );
    
    await review.deleteOne();
    await product.save();

    return respond(res, "SUCCESS", "Review deleted successfully");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to delete review", {
      errors: {
        message: (error as Error).message,
      },
    });
  }
};
