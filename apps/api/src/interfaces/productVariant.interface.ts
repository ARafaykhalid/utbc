import { Types } from "mongoose";

export interface IProductVariant {
  sku: string;
  price: number;
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
