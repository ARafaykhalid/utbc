import { Router } from "express";

import { validate } from "@api/middlewares";
import {
  AddReview,
  DeleteReview,
  MyReviews,
  UpdateReview,
} from "@api/controllers/reviews";
import {
  VAddReviewParams,
  VDeleteReview,
  VUpdateReviewBody,
  VUpdateReviewParams,
} from "@shared/validations/reviews";

const ReviewRoute = Router({ mergeParams: true });

ReviewRoute.get("/", MyReviews);

ReviewRoute.post(
  "/products/:productId/",
  validate({ params: VAddReviewParams, body: VAddReviewParams }),
  AddReview
);

ReviewRoute.patch(
  "/:reviewId/products/:productId/",
  validate({ body: VUpdateReviewBody, params: VUpdateReviewParams }),
  UpdateReview
);

ReviewRoute.delete(
  "/:reviewId/products/:productId/",
  validate({ params: VDeleteReview }),
  DeleteReview
);

export default ReviewRoute;
