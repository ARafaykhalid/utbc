import { Request, Response } from "express";
import { Types } from "mongoose";
import { ProductModel } from "@/models";
import { TUpdateProduct, TUpdateProductParam } from "@shared/validations";
import {
  assertDiscount,
  generateUniqueSlug,
  respond,
  uploadToCloudinary,
} from "@/utils";

export const UpdateProduct = async (req: Request, res: Response) => {
  const {
    title,
    description,
    price,
    discountPrice,
    stock,
    variants,
    images: imagesFromBody,
    category,
    tags,
    isActive,
  } = req.validated?.body as TUpdateProduct;
  const { productId } = req.params as TUpdateProductParam;

  try {
    assertDiscount(price, discountPrice);

    const product = await ProductModel.findById(productId);
    if (!product) return respond(res, "NOT_FOUND", "Product not found");

    // Apply partial updates only for provided fields
    if (title !== undefined && title !== product.title) {
      product.title = title;
      product.slug = await generateUniqueSlug(title);
    }
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (stock !== undefined) product.stock = stock;
    if (variants !== undefined) product.variants = variants;
    if (category !== undefined) {
      product.category = Types.ObjectId.isValid(category)
        ? new Types.ObjectId(category)
        : undefined;
    }
    if (tags !== undefined) product.tags = tags;
    if (isActive !== undefined) product.isActive = isActive;

    // handle uploaded files
    const files = Array.isArray(req.files)
      ? (req.files as Express.Multer.File[])
      : [];
    if (files.length) {
      const uploaded = await Promise.all(
        files.map(async (f) => {
          const { url } = await uploadToCloudinary(f.buffer, "products");
          return { url, alt: title ?? product.title };
        })
      );
      product.images = [...(product.images ?? []), ...uploaded];
    }

    await product.save();

    return respond(res, "SUCCESS", "Product updated", {
      data: { id: product._id, slug: product.slug },
    });
  } catch (err) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to update product", {
      errors: { message: (err as Error).message || "Unknown error" },
    });
  }
};
