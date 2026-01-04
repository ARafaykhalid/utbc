import { Request, Response } from "express";
import { ProductModel } from "@/models";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { TUpdateProductBody, TUpdateProductParams } from "@shared/validations";
import { Types } from "mongoose";
import { normalizedProductVariants } from "@/services";
import { ProductVariant } from "@/interfaces";

export const UpdateProduct = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const { productId } = req.validated?.params as TUpdateProductParams;
  const {
    category,
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

    if (category !== undefined) product.category = new Types.ObjectId(category);
    if (description !== undefined) product.description = description;
    if (discountedPrice !== undefined)
      product.discountedPrice = discountedPrice;
    if (isActive !== undefined) product.isActive = isActive;
    if (media !== undefined)
      product.media = media.map((id) => new Types.ObjectId(id));
    if (tags !== undefined) product.tags = tags;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;

    if (title !== undefined) product.title = title;
    if (variants !== undefined)
      product.variants = normalizedProductVariants(
        variants as unknown as ProductVariant[]
      );

    product.updatedBy = new Types.ObjectId(userId);

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
