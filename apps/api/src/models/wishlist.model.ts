import { IWishlist } from "@api/interfaces";
import { model, Schema } from "mongoose";
import { WishlistItemSchema } from "./sub-schemas/";

const WishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [WishlistItemSchema],
  },
  { timestamps: true }
);

export const WishlistModel = model<IWishlist>("Wishlist", WishlistSchema);
