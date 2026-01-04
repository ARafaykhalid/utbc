import { Request, Response } from "express";
import { WishlistModel } from "@/models/wishlist.model";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { Types } from "mongoose";
import { TAddToWishlist } from "@shared/validations";
import { getFormatedWishList } from "@/services";

export const AddToWishlist = async (req: Request, res: Response) => {
  const { userId } = req?.user as TAuthData;
  const { productId } = req.validated?.params as TAddToWishlist;

  try {
    const Wishlist = await WishlistModel.findOne({ user: userId });

    if (!Wishlist) {
      const newWishlist = new WishlistModel({
        user: userId,
        items: [{ product: productId }],
      });
      await newWishlist.save();

      const formattedWishlist = await getFormatedWishList(newWishlist);
      return respond(res, "SUCCESS", "Product added to wishlist", {
        data: formattedWishlist,
      });
    }

    // Check if product exists
    const exists = Wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (exists) {
      return respond(res, "VALIDATION_ERROR", "Product already in wishlist", {
        errors: { "body.productId": "Product already in wishlist" },
      });
    }

    // Add product
    Wishlist.items.push({
      product: new Types.ObjectId(productId),
      addedAt: new Date(),
    });
    await Wishlist.save();

    const formattedWishlist = await getFormatedWishList(Wishlist);

    return respond(res, "SUCCESS", "Product added to wishlist", {
      data: formattedWishlist,
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to add to wishlist", {
      errors: { message: (error as Error).message || "Unknown error" },
    });
  }
};
