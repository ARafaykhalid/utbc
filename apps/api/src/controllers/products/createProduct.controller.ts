import { Request, Response } from "express";
import { CategoryModel, ProductModel } from "@/models";
import { generateUniqueSlug, respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { TCreateProduct } from "@shared/validations";
import { Types } from "mongoose";

export const CreateProduct = async (req: Request, res: Response) => {
  const {
    title,
    description,
    price,
    discountedPrice,
    stock,
    variants,
    media,
    category,
    tags,
    isActive,
  } = req.validated?.body as TCreateProduct;

  const { userId } = req.user as TAuthData;

  try {
    const slug = await generateUniqueSlug(title, "Product");

    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
      return respond(
        res,
        "BAD_REQUEST",
        "Invalid category ID or category does not exist"
      );
    }

    const normalizedVariants = variants?.map((variant) => {
      const { sku, price, stock, attributes, media: variantMedia } = variant;

      return {
        sku,
        price,
        stock,
        attributes,
        media: new Types.ObjectId(variantMedia),
      };
    });

    const product = await ProductModel.create({
      title,
      slug,
      description,
      price,
      discountedPrice,
      stock,
      variants: normalizedVariants,
      media: media?.map((id) => new Types.ObjectId(id)),
      category: new Types.ObjectId(category),
      tags,
      isActive: isActive ?? false,
      createdBy: new Types.ObjectId(userId),
    });

    return respond(res, "SUCCESS", "Product created successfully", {
      data: {
        id: product._id,
        slug: product.slug,
      },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Product creation failed", {
      errors: {
        message: (error as Error).message,
      },
    });
  }
};
