import { UserSession } from "./sub-interfaces/userSession";
import { CartItem } from "./sub-interfaces/cartItem";
import { PurchasedItem } from "./sub-interfaces/purchasedItem";
import { UserAddress } from "./sub-interfaces/userAddress";
import { ObjectId } from "../types/ObjectId";

export type UserRole = "admin" | "user";

export interface IUser {
  _id: ObjectId;

  name: string;
  email: string;
  password: string;
  role: UserRole;

  sessions: UserSession[];

  cart: CartItem[];
  purchasedItems: PurchasedItem[];
  addresses?: UserAddress[];

  isBlocked: boolean;
  isEmailVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}
