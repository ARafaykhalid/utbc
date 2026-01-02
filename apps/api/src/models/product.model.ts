import { Schema, model } from "mongoose";
import {
  ProductRatingSchema,
  ProductVariantSchema,
  ReviewsSchema,
} from "./sub-schemas";
import { IProduct } from "@/interfaces";

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountedPrice: {
      type: Number,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    variants: [ProductVariantSchema],

    media: [{ type: Schema.Types.ObjectId, ref: "Media", required: true }],

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    tags: [{ type: String, index: true }],

    rating: { type: ProductRatingSchema, optional: true },
    reviews: [ReviewsSchema],

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = model<IProduct>("Product", ProductSchema);
