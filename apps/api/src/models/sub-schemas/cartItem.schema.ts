import { Schema } from "mongoose";

export const CartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, default: 1 },
    priceAtAdd: { type: Number, required: true },
    variant: { type: String },
  },
  { _id: false }
);
