import { Request, Response } from "express";
import { isValidObjectId, Types } from "mongoose";
import { TCreateProduct } from "@shared/validations";
import { TAuthData } from "@shared/types";
import { ProductModel } from "@/models";
import {
  assertDiscount,
  generateUniqueSlug,
  respond,
  uploadToCloudinary,
} from "@/utils";

export const CreateProduct = async (req: Request, res: Response) => {
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
  } = req.validated?.body as TCreateProduct;
  const { userId } = req.user as TAuthData;

  try {
    assertDiscount(price, discountPrice);

    // Multer files (memoryStorage) if present
    const files = Array.isArray(req.files)
      ? (req.files as Express.Multer.File[])
      : [];

    if (!files.length && (!imagesFromBody || imagesFromBody.length === 0)) {
      return respond(
        res,
        "BAD_REQUEST",
        "At least one product image is required",
        {
          errors: { "body.images": "images are required" },
        }
      );
    }

    let images = imagesFromBody ?? [];
    if (files.length) {
      const uploaded = await Promise.all(
        files.map(async (f) => {
          const { url } = await uploadToCloudinary(f.buffer, "products");
          return { url, alt: title };
        })
      );
      images = [...images, ...uploaded];
    }

    const slug = await generateUniqueSlug(title);

    const product = await ProductModel.create({
      title: title,
      slug: slug,
      description: description,
      price: price,
      discountPrice: discountPrice,
      stock: stock,
      variants: variants ?? [],
      category: new Types.ObjectId(category),
      media: images,
      tags: tags ?? [],
      isActive: isActive ?? true,
      createdBy: userId,
    });

    return respond(res, "SUCCESS", "Product created", {
      data: { id: product._id, slug: product.slug },
    });
  } catch (err) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Product creation failed", {
      errors: { message: (err as Error).message || "Unknown error" },
    });
  }
};
