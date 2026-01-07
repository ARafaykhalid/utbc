import { Request, Response } from "express";
import { CategoryModel, MediaModel, ProductModel } from "@/models";
import { generateUniqueSlug, respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { TCreateProduct } from "@shared/validations";

export const CreateProduct = async (req: Request, res: Response) => {
  const {
    title,
    description,
    price,
    discountedPrice,
    stock,
    media,
    categoryId,
    tags,
  } = req.validated!.body as TCreateProduct;

  const { userId } = req.user as TAuthData;

  try {
    const slug = await generateUniqueSlug(title, "Product");

    const categoryExists = await CategoryModel.exists({ _id: categoryId });
    if (!categoryExists) {
      return respond(res, "BAD_REQUEST", "Invalid category");
    }

    const mediaCount = await MediaModel.countDocuments({
      _id: { $in: media },
    });

    if (mediaCount !== media.length) {
      return respond(res, "BAD_REQUEST", "Invalid media IDs provided");
    }

    const product = await ProductModel.create({
      title,
      slug,
      description,
      price,
      discountedPrice,
      stock,
      media,
      tags,
      category: categoryId,
      isActive: false,
      createdBy: userId,
    });

    return respond(res, "SUCCESS", "Product created successfully", {
      data: {
        id: product._id,
        slug: product.slug,
      },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Product creation failed", {
      errors: { message: (error as Error).message },
    });
  }
};
