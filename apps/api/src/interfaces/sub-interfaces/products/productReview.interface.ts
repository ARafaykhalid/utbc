import { Types } from "mongoose";

export interface Review {
  userId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}
