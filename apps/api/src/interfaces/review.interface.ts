import { Types } from "mongoose";

export interface IReview {
  _id: Types.ObjectId;
  from: Types.ObjectId;
  product: Types.ObjectId;
  ratings: number;
  comment?: string;
  createdAt: Date;
}
