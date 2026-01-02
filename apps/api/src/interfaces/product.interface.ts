import { Types } from "mongoose";
import {
  ProductImage,
  ProductRating,
  ProductVariant,
  Review,
} from "./sub-interfaces";
import { IMedia } from "@/interfaces";

export interface IProduct {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  variants: ProductVariant[];
  media: IMedia[];
  category?: Types.ObjectId;
  tags: string[];
  rating?: ProductRating;
  reviews: Review[];
  isActive: boolean;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
