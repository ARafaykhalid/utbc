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
import { requireAuth, validate } from "@api/middlewares";
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

const ProductsRoute = Router();

ProductsRoute.get("/", validate({ query: VGetProducts }), GetProducts);
ProductsRoute.get("/:slug", validate({ params: VGetProduct }), GetProduct);
ProductsRoute.post("/", validate({ body: VCreateProduct }), requireAuth, CreateProduct);

ProductsRoute.patch(
  "/:productId",
  validate({ body: VUpdateProductBody, params: VUpdateProductParams }),
  requireAuth,
  UpdateProduct
);

ProductsRoute.delete(
  "/:productId",
  validate({ params: VDeleteProduct }),
  requireAuth,
  DeleteProduct
);

ProductsRoute.post(
  "/make-active",
  validate({ body: VMakeProductsActive }),
  requireAuth,
  MakeProductsActive
);

ProductsRoute.post(
  "/make-unactive",
  validate({ body: VMakeProductsUnActive }),
  requireAuth,
  MakeProductsUnActive
);

ProductsRoute.use("/:productId/variants", requireAuth, ProductVariantsRoute);

export default ProductsRoute;
