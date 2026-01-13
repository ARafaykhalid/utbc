import { IProductRating } from "@api/interfaces";
import { Schema } from "mongoose";

export const ProductRatingSchema = new Schema<IProductRating>(
  {
    average: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
  },
  { _id: false }
);
