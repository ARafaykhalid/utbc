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

  if (!isAdmin) {
    filter.isActive = true;
  }

  const query =
    quantity === "multiple"
      ? ProductModel.find(filter)
      : ProductModel.findOne(filter);

  /* -------------------- base populates -------------------- */
  query
    .populate({
      path: "category",
      model: "Category",
      select: "_id name slug",
    })
    .populate({
      path: "media",
      model: "Media",
      select: "url type -_id",
    });

  /* -------------------- SINGLE PRODUCT -------------------- */
  if (quantity === "single") {
    if (isAdmin) {
      query.populate({
        path: "variants",
        model: "ProductVariant",
        select: "sku price stock attributes media createdBy updatedBy",
        populate: [
          { path: "media", model: "Media", select: "url type -_id" },
          { path: "createdBy", model: "User", select: "name email _id" },
          { path: "updatedBy", model: "User", select: "name email _id" },
        ],
      });
    } else {
      query.populate({
        path: "variants",
        model: "ProductVariant",
        select: "sku price stock attributes media",
        populate: { path: "media", model: "Media", select: "url type -_id" },
      });
    }

    query.populate({
      path: "reviews",
      populate: {
        path: "from",
        model: "User",
        select: isAdmin ? "name email _id" : "name -_id",
      },
    });

    const singleFields = [
      "title",
      "description",
      "slug",
      "ratings",
      "price",
      "discountedPrice",
      "stock",
      "totalSold",
      "media",
      "category",
      "tags",
      "variants",
    ];

    if (isAdmin) {
      singleFields.push(
        "isActive",
        "buyers",
        "reviews",
        "createdBy",
        "updatedBy"
      );
      query
        .select(singleFields.join(" "))
        .populate({
          path: "createdBy",
          model: "User",
          select: "name email _id",
        })
        .populate({
          path: "updatedBy",
          model: "User",
          select: "name email _id",
        });
    } else {
      query.select(singleFields.join(" "));
    }
  } else {

  /* -------------------- MULTIPLE PRODUCTS -------------------- */
    // Populate only variant media (so we can merge later) but don't include variants in selection
    query.populate({
      path: "variants",
      model: "ProductVariant",
      select: "media", // only fetch media for variants
      populate: { path: "media", model: "Media", select: "url type -_id" },
    });

    const listFields = [
      "title",
      "slug",
      "ratings",
      "price",
      "discountedPrice",
      "stock",
      "media",
    ];

    if (isAdmin) {
      listFields.push("isActive", "createdBy", "updatedBy");
      query
        .populate({
          path: "createdBy",
          model: "User",
          select: "name email _id",
        })
        .populate({
          path: "updatedBy",
          model: "User",
          select: "name email _id",
        });
    }

    query.select(listFields.join(" ")); // note: variants is not included here
  }

  return query;
};
