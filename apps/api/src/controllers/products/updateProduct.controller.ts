import { Request, Response } from "express";
import { ProductModel } from "@/models";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { TUpdateProductBody, TUpdateProductParams } from "@shared/validations";
import { ProductVariant } from "@/interfaces";

export const UpdateProduct = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const { productId } = req.validated?.params as TUpdateProductParams;
  const {
    category: categoryId,
    description,
    discountedPrice,
    isActive,
    media,
    tags,
    price,
    stock,
    title,
    variants,
  } = req.validated?.body as TUpdateProductBody;

  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return respond(res, "NOT_FOUND", "Product not found");
    }

    if (categoryId !== undefined) product.category = categoryId;
    if (description !== undefined) product.description = description;
    if (discountedPrice !== undefined)
      product.discountedPrice = discountedPrice;
    if (isActive !== undefined) product.isActive = isActive;
    if (media !== undefined) product.media = media;
    if (tags !== undefined) product.tags = tags;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;

    if (title !== undefined) product.title = title;

    if (variants !== undefined)
      for (const variant of variants) {
        if (!media.includes(variant.media)) {
          return respond(
            res,
            "BAD_REQUEST",
            `Variant media ID ${variant.media} does not exist in provided media array`
          );
        }
      }

    product.variants = variants?.map((variant) => ({
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      attributes: variant.attributes,
      media: variant.media,
    })) as ProductVariant[];

    product.updatedBy = userId;

    await product.save();

    return respond(res, "SUCCESS", "Product updated successfully", {
      data: { product },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Product update failed", {
      errors: { message: (error as Error).message },
    });
  }
};
