import { Request, Response } from "express";
import { ProductModel, MediaModel, ProductVariantModel } from "@/models";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import {
  TUpdateProductVariantBody,
  TUpdateProductVariantParams,
} from "@shared/validations";

export const UpdateProductVariant = async (req: Request, res: Response) => {
  const { sku, price, stock, attributes, media } = req.validated
    ?.body as TUpdateProductVariantBody;

  const { productId, variantId } = req.validated
    ?.params as TUpdateProductVariantParams;
  const { userId } = req.user as TAuthData;

  try {
    const productVariant = await ProductVariantModel.findById(variantId);
    if (!productVariant) {
      return respond(res, "NOT_FOUND", "Product variant not found");
    }
    const product = await ProductModel.findById(productId);
    if (!product) {
      return respond(res, "BAD_REQUEST", "Invalid product ID");
    }

    const mediaExists = await MediaModel.exists({ _id: media });
    if (!mediaExists) {
      return respond(res, "BAD_REQUEST", "Invalid media ID");
    }
    if (sku) productVariant.sku = sku;
    if (price) productVariant.price = price;
    if (stock) productVariant.stock = stock;
    if (attributes) productVariant.attributes = attributes;
    if (media) productVariant.media = media;

    productVariant.updatedBy = userId;
    await product.save();
    await productVariant.save();

    return respond(res, "SUCCESS", "Variant updated successfully", {
      data: { id: productVariant._id, sku: productVariant.sku },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to update variant", {
      errors: { message: (error as Error).message },
    });
  }
};
