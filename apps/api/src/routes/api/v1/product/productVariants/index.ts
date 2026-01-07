import { Router } from "express";
import {
  VCreateProductVariantBody,
  VCreateProductVariantParams,
  VDeleteProductVariant,
  VUpdateProductVariantBody,
  VUpdateProductVariantParams,
} from "@shared/validations";
import { validate } from "@/middlewares";

import {
  CreateProductVariant,
  DeleteProductVariant,
  UpdateProductVariant,
} from "@/controllers/products/productVariants";

const ProductVariantsRoute = Router({ mergeParams: true });

ProductVariantsRoute.post(
  "/",
  validate({
    body: VCreateProductVariantBody,
    params: VCreateProductVariantParams,
  }),
  CreateProductVariant
);

ProductVariantsRoute.patch(
  "/:variantId",
  validate({
    body: VUpdateProductVariantBody,
    params: VUpdateProductVariantParams,
  }),
  UpdateProductVariant
);

ProductVariantsRoute.delete(
  "/:variantId",
  validate({
    params: VDeleteProductVariant,
  }),
  DeleteProductVariant
);

export default ProductVariantsRoute;
