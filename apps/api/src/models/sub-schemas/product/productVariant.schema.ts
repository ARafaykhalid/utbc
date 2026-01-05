import { Schema } from "mongoose";
import { IProductVariant } from "@/interfaces";

export const ProductVariantSchema = new Schema<IProductVariant>({
  sku: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
  },

  attributes: {
    size: { type: String },
    color: { type: String },
    material: { type: String },
  },

  media: { type: Schema.Types.ObjectId, ref: "Media", required: true },
});
