import { Schema } from "mongoose";

export const ProductVariantSchema = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);
