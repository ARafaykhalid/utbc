import { Request, Response } from "express";
import { CategoryModel, MediaModel, ProductModel } from "@/models";
import { generateUniqueSlug, respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { TCreateProduct } from "@shared/validations";
import { Types } from "mongoose";
import { ProductVariant } from "@/interfaces";
import { normalizedProductVariants } from "@/services";
import { ProductVariantSchema } from "@/models/sub-schemas";

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
    const mediaExists = await MediaModel.find({ _id: { $in: media } });
    if (mediaExists.length !== media.length) {
      return respond(
        res,
        "BAD_REQUEST",
        "One or more media IDs are invalid or do not exist"
      );
    }

    if (variants) {
      for (const variant of variants) {
        if (!media.includes(variant.media)) {
          return respond(
            res,
            "BAD_REQUEST",
            `Variant media ID ${variant.media} does not exist in provided media array`
          );
        }
      }
    }

    const product = await ProductModel.create({
      title,
      slug,
      description,
      price,
      discountedPrice,
      stock,
      variants: variants?.map((variant) => ({
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        attributes: variant.attributes,
        media: variant.media,
      })) as ProductVariant[],
      media: media,
      category: category,
      tags,
      isActive: isActive ?? false,
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
      errors: {
        message: (error as Error).message,
      },
    });
  }
};
