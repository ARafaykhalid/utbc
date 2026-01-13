import { IReview } from "@api/interfaces";
import { model, Schema } from "mongoose";

export const ReviewsSchema = new Schema<IReview>({
  from: { type: Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  comment: { type: String, default: "" },
  ratings: { type: Number, required: true, min: 1, max: 5 },
});

export const ReviewModel = model<IReview>("Review", ReviewsSchema);
