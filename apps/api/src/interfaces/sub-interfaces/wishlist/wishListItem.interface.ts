import { Types } from "mongoose";

export interface IWishlistItem {
  product: Types.ObjectId;
  addedAt: Date;
}
