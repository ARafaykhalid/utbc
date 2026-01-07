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
  VAddToWishlist,
  VMakeProductsActive,
} from "@shared/validations";
import { validate } from "@/middlewares";
import {
  CreateProduct,
  DeleteProduct,
  GetProduct,
  GetProducts,
  MakeProductsActive,
  UpdateProduct,
} from "@/controllers/products";
import { AddReview } from "@/controllers/reviews";
import { AddToWishlist } from "@/controllers/wishlist";
import ProductVariantsRoute from "./productVariants";
import ReviewRoute from "./review";

const ProductRoute = Router();

ProductRoute.get("/", validate({ query: VGetProducts }), GetProducts);
ProductRoute.get("/:slug", validate({ params: VGetProduct }), GetProduct);
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
  "/make-active",
  validate({ body: VMakeProductsActive }),
  MakeProductsActive
);

ProductRoute.use("/:productId/reviews", ReviewRoute);
ProductRoute.use("/:productId/variants", ProductVariantsRoute);

export default ProductRoute;
