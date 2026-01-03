import { Router } from "express";
import { VCreateProduct, VUpdateProduct } from "@shared/validations";
import { multerErrorHandler, upload, validate } from "@/middlewares";
// import { CreateProduct, UpdateProduct } from "@/controllers/products";

const ProductRoute = Router();

// ProductRoute.post(
//   "/products",
//   upload.array("images", 6),
//   multerErrorHandler,
//   validate({ body: VCreateProduct }),
//   CreateProduct
// );

// ProductRoute.patch(
//   "/products/:id",
//   upload.array("images", 6),
//   multerErrorHandler,
//   validate({ body: VUpdateProduct }),
//   UpdateProduct
// );

export default ProductRoute;
