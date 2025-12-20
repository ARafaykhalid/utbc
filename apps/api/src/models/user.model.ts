import mongoose, { Schema } from "mongoose";
import { IUser } from "@shared/interfaces/";
import { Session } from "./sub-models/sesson.model";
import { CartItem } from "./sub-models/cartItem.model";
import { PurchasedItem } from "./sub-models/purchasedItem.model";

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

UserSchema.index({ email: 1 });
UserSchema.index({ "sessions.token": 1 });

export default mongoose.model<IUser>("User", UserSchema);
