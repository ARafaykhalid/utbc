import { Types } from "mongoose";
import { ICartItem } from "./sub-interfaces/cart/cartItem.interface";

export interface ICart {
  user: Types.ObjectId;
  items: ICartItem[];

  subtotal: number;
  discount: number;
  total: number;

  updatedAt: Date;
}
