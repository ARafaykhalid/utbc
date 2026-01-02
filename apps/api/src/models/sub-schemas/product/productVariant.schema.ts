import { Schema } from "mongoose";
import { ProductVariant } from "@/interfaces";

export const ProductVariantSchema = new Schema<ProductVariant>(
  {
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
  },
  { _id: false }
);
