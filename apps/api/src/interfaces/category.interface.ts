import { Types } from "mongoose";

export interface ICategory {
  categoryId: Types.ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
