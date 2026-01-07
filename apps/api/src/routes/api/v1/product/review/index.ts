import { Router } from "express";

import { validate } from "@/middlewares";
import {
  AddReview,
  DeleteReview,
  GetReviews,
  UpdateReview,
} from "@/controllers/reviews";
import {
  VAddReviewParams,
  VDeleteReview,
  VGetReviews,
  VUpdateReviewBody,
  VUpdateReviewParams,
} from "@shared/validations";

const ReviewRoute = Router({ mergeParams: true });

ReviewRoute.post(
  "/",
  validate({ params: VAddReviewParams, body: VAddReviewParams }),
  AddReview
);

ReviewRoute.patch(
  "/:reviewId",
  validate({ body: VUpdateReviewBody, params: VUpdateReviewParams }),
  UpdateReview
);

ReviewRoute.delete(
  "/:reviewId",
  validate({ params: VDeleteReview }),
  DeleteReview
);

export default ReviewRoute;
