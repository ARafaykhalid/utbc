import { Router } from "express";

import { validate } from "@/middlewares";
import { DeleteReview, GetReviews, UpdateReview } from "@/controllers/reviews";
import {
  VDeleteReview,
  VGetReviews,
  VUpdateReviewBody,
  VUpdateReviewParams,
} from "@shared/validations";

const ReviewRoute = Router();

ReviewRoute.get("/", validate({ query: VGetReviews }), GetReviews);

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
