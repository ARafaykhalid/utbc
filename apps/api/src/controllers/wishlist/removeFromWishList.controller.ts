import { Request, Response } from "express";
import { WishlistModel } from "@/models/wishlist.model";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { TRemoveFromWishlist } from "@shared/validations";
import { ProductModel } from "@/models/product.model";
import { Types } from "mongoose";

export const RemoveFromWishlist = async (req: Request, res: Response) => {
  const { userId } = req?.user as TAuthData;
  const { slug } = req.validated?.params as TRemoveFromWishlist;

  try {
    const wishlist = await WishlistModel.findOne({ user: userId });
    const product = await ProductModel.findOne({ slug: slug });
    if (!product) {
      return respond(res, "NOT_FOUND", "Product not found", {
        errors: { slug: "Invalid product slug" },
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
