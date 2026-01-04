import { Types } from "mongoose";

export interface ICategory {
  categoryId: Types.ObjectId;
  name: string;
  description: string;
  slug: string;
  tags?: string[];
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
