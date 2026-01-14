import { Request, Response } from "express";
import { respond } from "@api/utils";
import { TAuthData, TUserRole } from "@shared/types";
import { TGetProduct } from "@shared/validations/products";
import { getProductsPopulated } from "@api/services/products";

export const GetProduct = async (req: Request, res: Response) => {
  const { slug } = req.validated?.params as TGetProduct;

  try {
    const query = getProductsPopulated(
      (req.user?.userRole ? req.user.userRole : "user") as TUserRole,
      { slug: slug },
      "single"
    );

    const product = await query.lean();

    if (!product || (Array.isArray(product) && product.length === 0))
      return respond(res, "NOT_FOUND", "Product not found");

    return respond(res, "SUCCESS", "Product fetched successfully", {
      data: { product },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch product", {
      errors: { message: (error as Error).message },
    });
  }
};
