import mongoose, { Schema } from "mongoose";

/* ======================
   Sub Schemas
====================== */

const ProductImageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String },
  },
  { _id: false }
);

const ProductVariantSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g. "Red / XL"
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const RatingSchema = new Schema(
  {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

/* ======================
   Product Schema
====================== */

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
