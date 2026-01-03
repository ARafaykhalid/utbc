import { IProduct, IWishlist } from "@/interfaces";
import { HydratedDocument, Types } from "mongoose";

export const getFormatedWishList = async (
  Wishlist: HydratedDocument<IWishlist>
) => {
  const populatedWishlist = await Wishlist.populate({
    path: "items.product",
    select: "title description price discountedPrice media",
  });

  const wishlistObj = populatedWishlist.toObject() as unknown as {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    items: { addedAt: Date; product: IProduct }[];
  };

  const formattedWishlist = {
    _id: wishlistObj._id,
    user: wishlistObj.user,
    createdAt: wishlistObj.createdAt,
    updatedAt: wishlistObj.updatedAt,
    items: wishlistObj.items.map((item) => ({
      addedAt: item.addedAt,
      product: {
        _id: item.product._id,
        title: item.product.title,
        description: item.product.description,
        price: item.product.price,
        discountedPrice: item?.product?.discountedPrice,
        media: item.product.media?.slice(0, 2) || [],
      },
    })),
  };
  return formattedWishlist;
};
