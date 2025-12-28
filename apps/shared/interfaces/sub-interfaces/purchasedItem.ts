import { ObjectId } from "@shared/types";

export interface PurchasedItem {
  product: ObjectId;
  quantity: number;
  pricePaid: number;
  orderId: ObjectId;
  purchasedAt: Date;
}
