import mongoose, { Schema } from "mongoose";
import { Session } from "./sub-models/session.model";
import { CartItem } from "./sub-models/cartItem.model";
import { PurchasedItem } from "./sub-models/purchasedItem.model";
import { IUser } from "@/interfaces/user.interface";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    sessions: [Session],

    cart: [CartItem],

    purchasedItems: [PurchasedItem],

    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
