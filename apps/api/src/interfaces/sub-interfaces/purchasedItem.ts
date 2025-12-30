import { Types } from "mongoose";

export interface IPurchasedItem {
  product: Types.ObjectId;
  quantity: number;
  pricePaid: number;
  orderId: Types.ObjectId;
  purchasedAt: Date;
}
