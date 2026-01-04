import { WishlistModel } from "@/models/wishlist.model";
import { TUserRole } from "@shared/types";
import { Types } from "mongoose";

export const getWishlistItemsPopulated = (
  userRole: TUserRole | undefined,
  prop?: Record<string, any> | Types.ObjectId | string,
  quantity: "single" | "multiple" = "single"
) => {
  const isAdmin = userRole === "admin";

  const productSelect =
    quantity === "single"
      ? "title price discountedPrice media"
      : "title slug ratings price discountedPrice stock media";

  const query =
    quantity === "single"
      ? WishlistModel.findOne(prop as Record<string, any>)
      : WishlistModel.find(prop as Record<string, any>);

  query.select("-user");
  query.populate({
    path: "items",
    populate: {
      path: "product",
      match: isAdmin ? {} : { isActive: true },
      select: isAdmin ? productSelect : `${productSelect} -isActive`,
      populate: {
        path: "media",
        model: "Media",
        select: "url type -_id",
      },
    },
  });

  return query;
};
