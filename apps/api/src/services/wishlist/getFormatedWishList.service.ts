import { WishlistModel } from "@/models/wishlist.model";
import { TUserRole } from "@shared/types";
import { Types } from "mongoose";

export const getWishlistItemsPopulated = async (
  userRole: TUserRole | undefined,
  prop?: Record<string, any> | Types.ObjectId | string
) => {
  const isAdmin = userRole === "admin";

  const productSelect = [
    "title",
    "slug",
    "ratings",
    "price",
    "discountedPrice",
    "stock",
    "media",
    "category",
    "tags",
  ].join(" ");

  const wishlist = await WishlistModel.find(prop as Record<string, any>)
    .select("-user")
    .populate({
      path: "items",
      populate: {
        path: "product",
        match: isAdmin ? {} : { isActive: true },
        select: isAdmin
          ? productSelect + " variants"
          : productSelect + " variants -isActive",
        populate: [
          {
            path: "media",
            model: "Media",
            select: "url type -_id",
          },
          {
            path: "variants",
            model: "ProductVariant",
            select: "media",
            populate: {
              path: "media",
              model: "Media",
              select: "url type -_id",
            },
          },
          {
            path: "category",
            model: "Category",
            select: "_id name slug",
          },
        ],
      },
    })
    .lean();

  return wishlist;
};
