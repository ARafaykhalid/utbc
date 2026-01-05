import { Schema, model } from "mongoose";
import { ICart } from "@/interfaces";
import { CartItemSchema } from "./sub-schemas";

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
      index: true,
    },

    items: {
      type: [CartItemSchema],
      default: [],
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const CartModel = model<ICart>("Cart", CartSchema);
