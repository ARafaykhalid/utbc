import { ObjectId } from "../../types/ObjectId";

export interface PurchasedItem {
  product: ObjectId;
  quantity: number;
  pricePaid: number;
  orderId: ObjectId;
  purchasedAt: Date;
}
