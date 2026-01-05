import { Types } from "mongoose";
import { IProductRating } from "./sub-interfaces";

export interface IProduct {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  totalSold: number;
  variants: Types.ObjectId[];
  media: Types.ObjectId[];
  category?: Types.ObjectId;
  tags: string[];
  wishedBy: Types.ObjectId[];
  ratings: IProductRating;
  reviews: Types.ObjectId[];
  isActive: boolean;
  buyers: [
    {
      userId: Types.ObjectId;
      orderId: Types.ObjectId;
    }
  ];
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
