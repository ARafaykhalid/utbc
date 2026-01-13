import { Router } from "express";
import {
  VCreateProduct,
  VGetProduct,
  VGetProducts,
  VDeleteProduct,
  VUpdateProductBody,
  VUpdateProductParams,
  VMakeProductsActive,
  VMakeProductsUnActive,
} from "@shared/validations/products";
import { validate } from "@api/middlewares";
import {
  CreateProduct,
  DeleteProduct,
  GetProduct,
  GetProducts,
  MakeProductsActive,
  MakeProductsUnActive,
  UpdateProduct,
} from "@api/controllers/products";
import ProductVariantsRoute from "./productVariants";

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

ProductRoute.post(
  "/make-unactive",
  validate({ body: VMakeProductsUnActive }),
  MakeProductsUnActive
);

ProductRoute.use("/:productId/variants", ProductVariantsRoute);

export default ProductRoute;
