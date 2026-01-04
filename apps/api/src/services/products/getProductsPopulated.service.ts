import { ProductModel } from "@/models";
import { normalizeFilter } from "@/utils";
import { TFilterArg, TUserRole } from "@shared/types";

export const getProductsPopulated = (
  userRole: TUserRole | undefined,
  prop?: TFilterArg,
  quantity: "single" | "multiple" = "single"
) => {
  const filter = normalizeFilter(prop);
  const isAdmin = userRole === "admin";

  if (userRole !== "admin") {
    filter.isActive = true;
  }

  const query =
    quantity === "multiple"
      ? ProductModel.find(filter)
      : ProductModel.findOne(filter);

  query
    .populate({ path: "category", select: "_id name slug", model: "Category" })
    .populate({ path: "media", select: "url type -_id", model: "Media" })
    .populate({
      path: "variants",
      populate: { path: "media", model: "Media", select: "url type -_id" },
    })
    .populate({
      path: "reviews",
      populate: {
        path: "from",
        model: "User",
        select: isAdmin ? "name email _id" : "name -_id",
      },
    });

  // select fields based on role & quantity
  if (quantity === "single") {
    const singleFields = [
      "title",
      "description",
      "slug",
      "ratings",
      "price",
      "discountedPrice",
      "stock",
      "totalSold",
      "variants",
      "media",
      "category",
      "tags",
    ];

    if (isAdmin) {
      // admin sees internal fields and creator/updater info
      singleFields.push(
        "isActive",
        "buyers",
        "reviews",
        "createdBy",
        "updatedBy"
      );
      query.select(singleFields.join(" "));
      query.populate({
        path: "createdBy",
        model: "User",
        select: "name email _id",
      });
      query.populate({
        path: "updatedBy",
        model: "User",
        select: "name email _id",
      });
    } else {
      query.select(singleFields.join(" "));
    }
  } else {
    // multiple results list
    const listFields = [
      "title",
      "slug",
      "ratings",
      "price",
      "discountedPrice",
      "stock",
      "variants",
      "media",
    ];

    if (isAdmin) {
      listFields.push("isActive", "createdBy", "updatedBy");
      query.populate({
        path: "createdBy",
        model: "User",
        select: "name email _id",
      });
      query.populate({
        path: "updatedBy",
        model: "User",
        select: "name email _id",
      });
    }

    query.select(listFields.join(" "));
  }

  return query;
};
