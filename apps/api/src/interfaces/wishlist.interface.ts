import { Types } from "mongoose";
import { IWishlistItem } from "./sub-interfaces";

export interface IWishlist {
  user: Types.ObjectId;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}