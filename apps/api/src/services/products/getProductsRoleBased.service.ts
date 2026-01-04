import { ProductModel } from "@/models";
import { TUserRole } from "@shared/types";
import { Types } from "mongoose";

export const getProductsRoleBased = (
  userRole: TUserRole | undefined,
  type: "single" | "multiple",
  prop?: Record<string, any> | Types.ObjectId | string
) => {
  const query =
    type === "single"
      ? ProductModel.findById(prop)
      : ProductModel.find(prop as Record<string, any>);

  query
    .populate("category", "_id name slug")
    .populate({
      path: "media",
      select: "url type -_id",
      model: "Media",
    })
    .populate({
      path: "variants",
      populate: {
        path: "media",
        model: "Media",
        select: "url type -_id",
      },
    })
    .populate({
      path: "reviews",
      populate: {
        path: "from",
        model: "User",
        select: userRole === "admin" ? "name email _id" : "name -_id",
      },
    });

  if (userRole === "admin") {
    query
      .populate("createdBy", "name email _id")
      .populate("updatedBy", "name email _id");
  } else {
    query.select(
      "title description ratings price discountedPrice stock totalSold variants media category tags"
    );
  }

  return query;
};
