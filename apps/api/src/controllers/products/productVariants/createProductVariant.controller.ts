import { Request, Response } from "express";
import { ProductModel, MediaModel, ProductVariantModel } from "@api/models";
import { generateUniqueSlug, respond } from "@api/utils";
import { TAuthData } from "@shared/types";
import {
  TCreateProductVariantBody,
  TCreateProductVariantParams,
} from "@shared/validations/products/productVariants";

export const CreateProductVariant = async (req: Request, res: Response) => {
  const { sku, price, stock, attributes, media } = req.validated
    ?.body as TCreateProductVariantBody;
  const { productId } = req.validated?.params as TCreateProductVariantParams;
  const { userId } = req.user as TAuthData;

  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return respond(res, "BAD_REQUEST", "Invalid product ID");
    }

    const mediaExists = await MediaModel.exists({ _id: media });
    if (!mediaExists) {
      return respond(res, "BAD_REQUEST", "Invalid media ID");
    }
    const unigueSku = await generateUniqueSlug(sku, "ProductVariant");

    const variant = await ProductVariantModel.create({
      sku: unigueSku,
      price,
      stock,
      attributes,
      media,
      createdBy: userId,
    });

    product.variants.push(variant._id);
    await product.save();

    return respond(res, "SUCCESS", "Variant created successfully", {
      data: { id: variant._id, sku: variant.sku },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to create variant", {
      errors: { message: (error as Error).message },
    });
  }
};
