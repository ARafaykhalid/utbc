import { Request, Response } from "express";
import { ProductModel } from "@/models";
import { respond } from "@/utils";
import { TGetProducts } from "@shared/validations";
import { TAuthData } from "@shared/types";
import { getProductsRoleBased } from "@/services";

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

  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(limit, 100);
  const skip = (safePage - 1) * safeLimit;

  // Base filter
  const filter: Record<string, any> = {};

  // Role-based visibility
  if (userRole !== "admin") {
    filter.isActive = true;
  }

  // Filtering
  if (category) filter.category = category;
  if (tag) filter.tags = tag;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (ratings) {
    filter["ratings.average"] = { $gte: Number(ratings) };
  }

  try {
    let query = getProductsRoleBased(userRole, "multiple", filter);

    // Sorting
    if (bestSelling) {
      query = query.sort({ totalSold: -1 });
    } else if (highestRated) {
      query = query.sort({ "ratings.average": -1 });
    } else {
      query = query.sort({ [sortBy]: order } as Record<string, 1 | -1>);
    }

    // Pagination
    query = query.skip(skip).limit(safeLimit);

    // Execute in parallel with total count
    const [products, total] = await Promise.all([
      query.lean(),
      ProductModel.countDocuments(filter),
    ]);

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
