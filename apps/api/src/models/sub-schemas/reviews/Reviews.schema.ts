import { Schema } from "mongoose";

export const ReviewsSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { _id: false }
);