import { IWishlistItem } from "@api/interfaces";
import { Schema } from "mongoose";

export const WishlistItemSchema = new Schema<IWishlistItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    addedAt: { type: Date, default: Date.now, required: true },
  },
  { _id: false } // don’t create separate _id for each item
);
