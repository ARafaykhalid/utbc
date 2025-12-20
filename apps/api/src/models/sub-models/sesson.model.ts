import { Schema } from "mongoose";

export const Session = new Schema(
  {
    token: { type: String, required: true },
    ip: { type: String },
    userAgent: {
      browser: String,
      os: String,
      device: String,
    },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  { _id: false }
);
