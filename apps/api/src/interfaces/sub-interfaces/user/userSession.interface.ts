import { Types } from "mongoose";

export interface IUserSession {
  _id: Types.ObjectId;
  token: string;
  ip?: string;
  userAgent?: {
    browser?: string;
    os?: string;
    device?: string;
  };
  location?: {
    country?: string;
    city?: string;
  };
  createdAt: Date;
  expiresAt?: Date;
}
