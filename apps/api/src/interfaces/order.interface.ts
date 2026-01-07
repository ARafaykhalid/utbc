import { Types } from "mongoose";
import { ICartItem, IUserAddress } from "./sub-interfaces";

export interface IOrder {
  user: Types.ObjectId;
  items: ICartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon: string;
  paymentStatus:
    | "pending confirmation"
    | "confirmed"
    | "pending payment"
    | "expired"
    | "paid"
    | "refunded";
  deliveryStatus:
    | "processing"
    | "pending"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentIntentId?: string;
  paymentMethod: "STRIPE" | "COD";
  shippingAddress: IUserAddress;
  confirmationToken?: string | null;
  confirmationTokenExpiresAt?: Date | null;
  reservedUntil?: Date;
  canceledBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}
