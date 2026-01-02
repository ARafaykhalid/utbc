import { Types } from "mongoose";

export interface IMedia {
  url: string;
  publicId: string;
  type: "image" | "video";
  alt?: string;
  uploadedBy: Types.ObjectId;
  tags?: string[];
  createdAt: Date;
}
