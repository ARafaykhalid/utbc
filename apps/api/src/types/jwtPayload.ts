import { Types } from "mongoose";

export interface JwtPayload {
  _id: Types.ObjectId;
  sessionId: Types.ObjectId;
  role: "admin" | "user";
  iat?: number;
  exp?: number;
}
