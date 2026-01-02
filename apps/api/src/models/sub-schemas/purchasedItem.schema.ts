import { Schema } from "mongoose";
import { IPurchasedItem } from "@/interfaces";

export const PurchasedItemSchema = new Schema<IPurchasedItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: Number,
    pricePaid: Number,
    purchasedAt: { type: Date, default: Date.now },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { _id: false }
);
