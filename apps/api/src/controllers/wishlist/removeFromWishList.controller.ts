import { Request, Response } from "express";
import { WishlistModel } from "@/models/wishlist.model";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { TRemoveFromWishlist } from "@shared/validations";

export const RemoveFromWishlist = async (req: Request, res: Response) => {
  const { userId } = req?.user as TAuthData;
  const { productId } = req.validated?.params as TRemoveFromWishlist;

  try {
    const wishlist = await WishlistModel.findOne({ user: userId });
    if (!wishlist) {
      return respond(res, "VALIDATION_ERROR", "Wishlist not found", {
        errors: { wishlist: "Wishlist not found" },
      });
    }

    const itemExists = wishlist.items.some(
      (item) => item.product.toString() === productId
    );
    if (!itemExists) {
      return respond(res, "VALIDATION_ERROR", "Product not in wishlist", {
        errors: { productId: "Product not in wishlist" },
      });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();

    return respond(res, "SUCCESS", "Product removed from wishlist", {
      data: wishlist,
    });
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
