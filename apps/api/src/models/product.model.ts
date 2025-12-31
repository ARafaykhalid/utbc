import mongoose, { Schema } from "mongoose";
import { ProductVariantSchema } from "./sub-schemas/product/productVariant.schema";
import { ReviewsSchema } from "./sub-schemas/reviews/Reviews.schema";
import { RatingSchema } from "./sub-schemas/product/rating.schema";
import { ProductImageSchema } from "./sub-schemas/product/productImage.schema";

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
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

    discountPrice: {
      type: Number,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    variants: [ProductVariantSchema],

    images: [ProductImageSchema],

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    tags: [{ type: String, index: true }],

    rating: RatingSchema,
    reviews: [ReviewsSchema],

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
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

/* ======================
   Indexes (performance)
====================== */

ProductSchema.index({ title: "text", description: "text" });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

export default mongoose.model("Product", ProductSchema);
