import { Types } from "mongoose";

export interface IProductVariant {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  sku: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  attributes?: {
    size?: string;
    color?: string;
    material?: string;
  };
  media: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
