import { ObjectId } from "../../types/ObjectId";

export interface CartItem {
  product: ObjectId;
  quantity: number;
  priceAtAdd: number;
  variant?: string;
}
