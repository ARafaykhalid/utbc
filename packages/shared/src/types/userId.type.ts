import { Types } from "mongoose";
import { TUserRole } from "./userRole.type";

export type TAuthData = {
  userId?: Types.ObjectId;
  sessionId: Types.ObjectId;
  userRole?: TUserRole;
};
