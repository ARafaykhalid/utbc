import { Types } from "mongoose";

export interface IUserSession {
  sessionId: Types.ObjectId;
  token: string;
  ip?: string;
  userAgent?: {
    browser?: string;
    os?: string;
    device?: string;
  };
  createdAt: Date;
  expiresAt?: Date;
}
