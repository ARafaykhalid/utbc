import { IUserSession } from "@api/interfaces";
import { Schema } from "mongoose";

export const UserSessionSchema = new Schema<IUserSession>({
  token: { type: String, required: true },
  ip: { type: String },
  userAgent: {
    browser: String,
    os: String,
    device: String,
  },
  location: {
    country: String,
    city: String,
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});
