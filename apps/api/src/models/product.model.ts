import { Schema, model } from "mongoose";
import { ProductRatingSchema } from "./sub-schemas";
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

    totalSold: {
      type: Number,
      default: 0,
      min: 0,
    },

    buyers: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        orderId: { type: Schema.Types.ObjectId, ref: "Order" },
      },
    ],

    variants: [
      { type: Schema.Types.ObjectId, ref: "ProductVariant", required: false },
    ],

    media: [{ type: Schema.Types.ObjectId, ref: "Media", required: true }],

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    tags: [{ type: String, index: true }],

    wishedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],

    ratings: {
      type: ProductRatingSchema,
      default: () => ({ average: 0, totalRatings: 0 }),
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = model<IProduct>("Product", ProductSchema);
