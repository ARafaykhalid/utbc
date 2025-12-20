import { Schema } from "mongoose";

export const PurchasedItem = new Schema(
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
