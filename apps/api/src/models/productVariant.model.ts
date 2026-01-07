import { IProductVariant } from "@/interfaces";
import { model, Schema } from "mongoose";

export const ProductVariantSchema = new Schema<IProductVariant>(
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

    discountedPrice: {
      type: Number,
      min: 0,
      default: null,
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

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    media: { type: Schema.Types.ObjectId, ref: "Media", required: true },
  },
  { timestamps: true }
);

export const ProductVariantModel = model<IProductVariant>(
  "ProductVariant",
  ProductVariantSchema
);
