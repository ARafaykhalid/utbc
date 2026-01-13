import { Request, Response } from "express";
import { WishlistModel } from "@api/models/wishlist.model";
import { respond } from "@api/utils";
import { TAuthData } from "@shared/types";
import { Types } from "mongoose";
import { TAddToWishlist } from "@shared/validations/wishlist";
import { ProductModel } from "@api/models";

export const AddToWishlist = async (req: Request, res: Response) => {
  const { userId } = req?.user as TAuthData;
  const { productId } = req.validated?.body as TAddToWishlist;

  try {
    const Wishlist = await WishlistModel.findOne({ user: userId });
    const productExists = await ProductModel.findById(productId);
    if (!productExists) {
      return respond(res, "NOT_FOUND", "Product not found", {
        errors: { "body.productId": "Invalid product ID" },
      });
    }
    const productAdded = {
      slug: productExists.slug,
      title: productExists.title,
      media: productExists.media,
    };

    if (!Wishlist) {
      const newWishlist = new WishlistModel({
        user: userId,
        items: [{ product: productExists._id, addedAt: new Date() }],
      });
      productExists.wishedBy.push(userId as Types.ObjectId);

      await newWishlist.save();
      await productExists.save();
      return respond(res, "SUCCESS", "Product added to wishlist", {
        data: { items: productAdded },
      });
    }
    const existsInProductWish = productExists.wishedBy.some(
      (id) => id.toString() === (userId as Types.ObjectId).toString()
    );

    // Check if product exists
    const exists = Wishlist.items.some(
      (item) => item.product.toString() === productExists._id.toString()
    );

    if (exists || existsInProductWish) {
      return respond(res, "VALIDATION_ERROR", "Product already in wishlist", {
        errors: { "body.productId": "Product already in wishlist" },
      });
    }

    // Add product
    productExists.wishedBy.push(userId as Types.ObjectId);
    Wishlist.items.push({
      product: productExists._id,
      addedAt: new Date(),
    });

    await Wishlist.save();
    await productExists.save();

    return respond(res, "SUCCESS", "Product added to wishlist", {
      data: { item: productAdded },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to add to wishlist", {
      errors: { message: (error as Error).message || "Unknown error" },
    });
  }
};
