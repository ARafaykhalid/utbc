import { Request, Response } from "express";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { Types } from "mongoose";
import { ProductModel, ReviewModel } from "@/models";
import { TAddReviewBody, TAddReviewParams } from "@shared/validations";

export const AddReview = async (req: Request, res: Response) => {
  const { slug } = req.validated?.params as TAddReviewParams;
  const { ratings, comment } = req.validated?.body as TAddReviewBody;

  const { userId } = req.user as TAuthData;

  try {
    const product = await ProductModel.findOne({ slug: slug });
    if (!product) {
      return respond(res, "NOT_FOUND", "Product not found. Cannot add review.");
    }
    const newReview = {
      from: userId,
      product: product._id,
      ratings,
      comment,
      createdAt: new Date(),
    };
    const review = await ReviewModel.create(newReview);

    product.reviews.push(review._id);
    const total = product.ratings.totalRatings + 1;
    const average =
      total === 1
        ? ratings
        : (product.ratings.average * product.ratings.totalRatings + ratings) /
          total;

    product.ratings.totalRatings = total;
    product.ratings.average = average;

    await product.save();

    return respond(res, "SUCCESS", "Review added successfully");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to add review", {
      errors: {
        message: (error as Error).message,
      },
    });
  }
};
