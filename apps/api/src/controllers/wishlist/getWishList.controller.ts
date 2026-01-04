import { Request, Response } from "express";
import { WishlistModel } from "@/models/wishlist.model";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { getFormatedWishList } from "@/services";

export const GetWishlist = async (req: Request, res: Response) => {
  const { userId } = req?.user as TAuthData;

  try {
    const wishlist = await WishlistModel.findOne({ user: userId });

    if (!wishlist) {
      return respond(res, "SUCCESS", "Wishlist is empty", {
        data: { items: [] },
      });
    }

    const formattedWishlist = await getFormatedWishList(wishlist);

    return respond(res, "SUCCESS", "Wishlist fetched successfully", {
      data: formattedWishlist,
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch wishlist", {
      errors: { message: (error as Error).message || "Unknown error" },
    });
  }
};
