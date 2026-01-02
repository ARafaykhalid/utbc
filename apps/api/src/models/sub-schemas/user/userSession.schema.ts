import { IUserSession } from "@/interfaces";
import { Schema } from "mongoose";

export const UserSessionSchema = new Schema<IUserSession>(
  {
    sessionId: { type: Schema.Types.ObjectId, required: true },
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
