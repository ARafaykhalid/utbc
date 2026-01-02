import { Types } from "mongoose";

export type TAuthData = {
  userId?: Types.ObjectId;
  sessionId: Types.ObjectId;
  role?: string;
};
