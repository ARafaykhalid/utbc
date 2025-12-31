import { IUserSession } from "./sub-interfaces/userSession";
import { ICartItem } from "./sub-interfaces/cartItem";
import { IUserAddress } from "./sub-interfaces/userAddress";
import { IPurchasedItem } from "./sub-interfaces/purchasedItem";
import { Types } from "mongoose";
import { UserRole } from "@shared/types";

export interface IUser {
  _id: Types.ObjectId;

  name: string;
  email: string;
  password: string;
  role: UserRole;

  sessions: IUserSession[];

  cart: ICartItem[];
  purchasedItems: IPurchasedItem[];
  address?: IUserAddress;

  isBlocked: boolean;
  isEmailVerified: boolean;

  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  emailVerificationToken?: string | null;
  emailVerificationExpires?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}
