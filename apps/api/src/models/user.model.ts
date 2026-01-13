import { IUser } from "@api/interfaces";
import { model, Schema } from "mongoose";
import { UserAddressSchema, UserSessionSchema } from "./sub-schemas";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, index: true },

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
      index: true,
    },

    sessions: [UserSessionSchema],

    isEmailVerified: { type: Boolean, default: false, index: true },

    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },

    newEmail: {
      type: String,
      unique: true,
      lowercase: true,
    },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },

    isBlocked: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", UserSchema);
