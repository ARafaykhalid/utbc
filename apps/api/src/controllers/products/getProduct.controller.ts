import { ProductModel } from "@/models";
import { getProductsRoleBased } from "@/services";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { TGetProduct } from "@shared/validations";
import { Request, Response } from "express";
import { Types } from "mongoose";

export const GetProduct = async (req: Request, res: Response) => {
  const { productId } = req.validated?.params as TGetProduct;
  const { userRole } = req.user as TAuthData;

  try {
    let query = getProductsRoleBased(userRole, "single", productId);
    const product = await query.lean();

    if (!product) {
      return respond(res, "NOT_FOUND", "Product not found");
    }

    return respond(res, "SUCCESS", "Product fetched successfully", {
      data: { product },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch product", {
      errors: { message: (error as Error).message },
    });
  }
};
