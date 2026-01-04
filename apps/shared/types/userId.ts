import { Types } from "mongoose";
import { TUserRole } from "./userRole";

export type TAuthData = {
  userId?: Types.ObjectId;
  sessionId: Types.ObjectId;
  userRole?: TUserRole;
};
