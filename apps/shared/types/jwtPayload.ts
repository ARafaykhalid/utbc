import { Types } from "mongoose";

export type TJwtPayload = {
  _id: Types.ObjectId;
  sessionId: Types.ObjectId;
  role: "admin" | "user";
  iat?: number;
  exp?: number;
};
