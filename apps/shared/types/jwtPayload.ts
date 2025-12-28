import { ObjectId } from "@shared/types";

export interface JwtPayload {
  _id: ObjectId;
  role: "admin" | "user";
  iat?: number;
  exp?: number;
}
