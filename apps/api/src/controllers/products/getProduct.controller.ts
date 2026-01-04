import { getProductsPopulated } from "@/services";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { TGetProduct } from "@shared/validations";
import { Request, Response } from "express";

export const GetProduct = async (req: Request, res: Response) => {
  const { slug } = req.validated?.params as TGetProduct;
  const { userRole } = req.user as TAuthData;

  try {
    const query = getProductsPopulated(userRole, { slug: slug }, "single");

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
