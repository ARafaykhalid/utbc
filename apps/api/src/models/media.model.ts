import { IMedia } from "@/interfaces";
import { model, Schema } from "mongoose";

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], default: "image" },
    alt: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: String }],
  },
  { timestamps: { createdAt: "createdAt" }, _id: true }
);

export const MediaModel = model<IMedia>("Media", MediaSchema);
