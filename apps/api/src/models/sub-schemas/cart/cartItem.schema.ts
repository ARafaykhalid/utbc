import { ICartItem } from "@api/interfaces";
import { Schema } from "mongoose";

export const CartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variant: {
      type: Schema.Types.ObjectId,
      required: false,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    title: {
      type: String,
      required: true,
    },

    media: {
      type: Schema.Types.ObjectId,
      ref: "Media",
      required: true,
    },
  },
  { _id: false }
);
