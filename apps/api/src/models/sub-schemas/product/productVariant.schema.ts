import { Schema } from "mongoose";
import { ProductVariant } from "@/interfaces";
import { ProductImageSchema } from "./productImage.schema";

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

    image: ProductImageSchema,
  },
  { _id: false }
);
