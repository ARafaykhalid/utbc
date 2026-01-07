import { Request, Response } from "express";
import { MediaModel, ProductModel } from "@/models";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { TUpdateProductBody, TUpdateProductParams } from "@shared/validations";

export const UpdateProduct = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const { productId } = req.validated?.params as TUpdateProductParams;
  const {
    categoryId,
    description,
    discountedPrice,
    media,
    tags,
    price,
    stock,
    title,
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

    if (tags !== undefined) product.tags = tags;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;

    if (title !== undefined) product.title = title;

    if (media) {
      const mediaCount = await MediaModel.countDocuments({
        _id: { $in: media },
      });
      if (mediaCount !== media.length) {
        return respond(res, "BAD_REQUEST", "Invalid media IDs provided");
      }
      product.media = media;
    }

    product.isActive = false;
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
