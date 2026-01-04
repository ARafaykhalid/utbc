import { Router } from "express";
import {
  VCreateProduct,
  VGetProduct,
  VGetProducts,
  VDeleteProduct,
  VAddReviewParams,
  VUpdateProductBody,
  VUpdateProductParams,
  VAddReviewBody,
} from "@shared/validations";
import { validate } from "@/middlewares";
import {
  CreateProduct,
  DeleteProduct,
  GetProduct,
  GetProducts,
  UpdateProduct,
} from "@/controllers/products";
import { AddReview } from "@/controllers/reviews";

const ProductRoute = Router();

ProductRoute.get("/", validate({ query: VGetProducts }), GetProducts);
ProductRoute.get("/:productId", validate({ params: VGetProduct }), GetProduct);
ProductRoute.post("/", validate({ body: VCreateProduct }), CreateProduct);

ProductRoute.patch(
  "/:productId",
  validate({ body: VUpdateProductBody, params: VUpdateProductParams }),
  UpdateProduct
);

ProductRoute.delete(
  "/:productId",
  validate({ params: VDeleteProduct }),
  DeleteProduct
);

ProductRoute.post(
  "/:productId/review",
  validate({ body: VAddReviewBody, params: VAddReviewParams }),
  AddReview
);

export default ProductRoute;
