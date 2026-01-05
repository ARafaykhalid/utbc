import { Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  variant?: Types.ObjectId;
  quantity: number;

  price: number;

  title: string;
  media: Types.ObjectId;
}
