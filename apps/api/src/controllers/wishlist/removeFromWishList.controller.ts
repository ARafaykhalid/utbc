import { Request, Response } from "express";
import { WishlistModel } from "@api/models/wishlist.model";
import { respond } from "@api/utils";
import { TAuthData } from "@shared/types";
import { TRemoveFromWishlist } from "@shared/validations/wishlist";
import { ProductModel } from "@api/models/product.model";
import { Types } from "mongoose";

export const RemoveFromWishlist = async (req: Request, res: Response) => {
  const { userId } = req?.user as TAuthData;
  const { productId } = req.validated?.params as TRemoveFromWishlist;

  try {
    const wishlist = await WishlistModel.findOne({ user: userId });
    const product = await ProductModel.findById(productId);
    if (!product) {
      return respond(res, "NOT_FOUND", "Product not found", {
        errors: { productId: "Invalid product ID" },
      });
    }

    if (!wishlist) {
      return respond(res, "VALIDATION_ERROR", "Wishlist not found", {
        errors: { wishlist: "Wishlist not found" },
      });
    }

    const itemExists = wishlist.items.some(
      (item) => item.product.toString() === product._id.toString()
    );
    if (!itemExists) {
      return respond(res, "VALIDATION_ERROR", "Product not in wishlist", {
        errors: { slug: "Product not in wishlist" },
      });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== product._id.toString()
    );

    product.wishedBy = product.wishedBy.filter(
      (id) => id.toString() !== (userId as Types.ObjectId).toString()
    );

    await product.save();
    await wishlist.save();

    return respond(res, "SUCCESS", "Product removed from wishlist");
  } catch (error) {
    return respond(
      res,
      "INTERNAL_SERVER_ERROR",
      "Failed to remove from wishlist",
      {
        errors: { message: (error as Error).message || "Unknown error" },
      }
    );
  }
};
