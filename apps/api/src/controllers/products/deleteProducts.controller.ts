import { Request, Response } from "express";
import { ProductModel } from "@api/models";
import { respond } from "@api/utils";
import { TUpdateProductParams } from "@shared/validations/products";

export const DeleteProduct = async (req: Request, res: Response) => {
  const { productId } = req.validated?.params as TUpdateProductParams;

  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return respond(res, "NOT_FOUND", "Product not found");
    }
    await product.deleteOne();

    return respond(res, "SUCCESS", "Product deleted successfully");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to delete product", {
      errors: { message: (error as Error).message },
    });
  }
};
