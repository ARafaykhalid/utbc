import { Request, Response } from "express";
import { ProductModel, ProductVariantModel } from "@api/models";
import { respond } from "@api/utils";
import { TDeleteProductVariant } from "@shared/validations/products/productVariants";

export const DeleteProductVariant = async (req: Request, res: Response) => {
  const { variantId, productId } = req.validated
    ?.params as TDeleteProductVariant;

  try {
    const productVariant = await ProductVariantModel.findById(variantId);
    if (!productVariant) {
      return respond(res, "NOT_FOUND", "Product variant not found");
    }
    const product = await ProductModel.findById(productId);
    if (!product) {
      return respond(res, "BAD_REQUEST", "Invalid product ID");
    }

    product.variants = product.variants.filter(
      (id) => id.toString() !== variantId?.toString()
    );

    await productVariant.deleteOne();
    await product.save();

    return respond(res, "SUCCESS", "Variant deleted successfully");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to delete variant", {
      errors: { message: (error as Error).message },
    });
  }
};
