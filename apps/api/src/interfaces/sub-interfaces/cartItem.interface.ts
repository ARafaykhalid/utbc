import { Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
  priceAtAdd: number;
  variant?: string;
}
