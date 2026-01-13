import { Request, Response } from "express";
import { ProductModel } from "@api/models";
import { respond } from "@api/utils";
import { TGetProducts } from "@shared/validations/products";
import { TAuthData } from "@shared/types";
import { getProductsPopulated } from "@api/services/products";

export const GetProducts = async (req: Request, res: Response) => {
  const { userRole } = req.user as TAuthData;
  const {
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    order = -1,
    search,
    category,
    tag,
    minPrice,
    maxPrice,
    bestSelling,
    highestRated,
    ratings,
  } = req.validated?.query as TGetProducts;

  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, limit);
  const skip = (safePage - 1) * safeLimit;

  // Base filter
  const filter: Record<string, any> = {};
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }
  if (ratings) filter["ratings.average"] = { $gte: Number(ratings) };
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  try {
    let query = getProductsPopulated(userRole, filter, "multiple");

    // Sorting
    if (bestSelling) query = query.sort({ totalSold: -1 });
    else if (highestRated) query = query.sort({ "ratings.average": -1 });
    else query = query.sort({ [sortBy]: order } as Record<string, 1 | -1>);

    // Pagination
    query = query.skip(skip).limit(safeLimit);

    // Execute query and count in parallel
    const [products, total] = await Promise.all([
      query.lean(),
      ProductModel.countDocuments(filter),
    ]);

    // Return empty array if nothing found
    if (!products || total === 0) {
      return respond(res, "SUCCESS", "No products found", {
        data: {
          products: [],
          pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages: 0,
          },
        },
      });
    }

    // Success response
    return respond(res, "SUCCESS", "Products fetched successfully", {
      data: {
        products,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages: Math.ceil(total / safeLimit),
        },
      },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch products", {
      errors: { message: (error as Error).message || "Unknown error" },
    });
  }
};
