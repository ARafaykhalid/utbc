import { Types } from "mongoose";
import { ProductRating, ProductVariant } from "./sub-interfaces";

export interface IProduct {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  totalSold: number;
  variants: ProductVariant[];
  media: Types.ObjectId[];
  category?: Types.ObjectId;
  tags: string[];
  buyers: [
    {
      userId: Types.ObjectId;
      orderId: Types.ObjectId;
    }
  ];
  wishedBy: Types.ObjectId[];
  ratings: ProductRating;
  reviews: Types.ObjectId[];
  isActive: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
