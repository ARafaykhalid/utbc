import { ProductRating } from "@/interfaces";
import { Schema } from "mongoose";

export const ProductRatingSchema = new Schema<ProductRating>(
  {
    average: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
  },
  { _id: false }
);
