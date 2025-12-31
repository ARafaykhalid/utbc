import mongoose, { Schema } from "mongoose";
import { UserSessionSchema } from "./sub-schemas/user/userSession.schema";
import { CartItemSchema } from "./sub-schemas/cartItem.schema";
import { PurchasedItemSchema } from "./sub-schemas/purchasedItem.schema";
import { IUser } from "@/interfaces/user.interface";
import { UserAddressSchema } from "./sub-schemas/user/userAddress.schema";

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

    address: UserAddressSchema,

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    sessions: [UserSessionSchema],

    cart: [CartItemSchema],

    purchasedItems: [PurchasedItemSchema],

    isEmailVerified: { type: Boolean, default: false },

    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },

    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },

    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
