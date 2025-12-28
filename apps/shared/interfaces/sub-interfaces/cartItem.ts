import { ObjectId } from "@shared/types";

export interface CartItem {
  product: ObjectId;
  quantity: number;
  priceAtAdd: number;
  variant?: string;
}
