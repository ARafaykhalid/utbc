import { Request, Response } from "express";
import { WishlistModel } from "@api/models";
import { respond } from "@api/utils";
import { TAuthData } from "@shared/types";
import { getWishlistItemsPopulated } from "@api/services/wishlist";

export const MyWishlist = async (req: Request, res: Response) => {
  const { userId, userRole } = req?.user as TAuthData;

  try {
    const wishlist = await WishlistModel.findOne({ user: userId });

    if (!wishlist) {
      return respond(res, "SUCCESS", "Wishlist is empty", {
        data: { items: [] },
      });
    }

    const formattedWishlist = await getWishlistItemsPopulated(
      userRole,
      wishlist
    );

    return respond(res, "SUCCESS", "Wishlist fetched successfully", {
      data: formattedWishlist,
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch wishlist", {
      errors: { message: (error as Error).message || "Unknown error" },
    });
  }
};
