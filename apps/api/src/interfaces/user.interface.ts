import { Types } from "mongoose";
import { TUserRole } from "@shared/types";
import {
  ICartItem,
  IPurchasedItem,
  IUserAddress,
  IUserSession,
} from "./sub-interfaces";

export interface IUser {
  _id: Types.ObjectId;

  name: string;
  email: string;
  password: string;
  role: TUserRole;

  sessions: IUserSession[];

  cart: ICartItem[];
  purchasedItems: IPurchasedItem[];
  address?: IUserAddress;

  isBlocked: boolean;
  isEmailVerified: boolean;

  newEmail?: string;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  emailVerificationToken?: string | null;
  emailVerificationExpires?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}
