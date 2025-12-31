import { Schema } from "mongoose";

export const ProductImageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String },
  },
  { _id: false }
);
