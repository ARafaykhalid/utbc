import { Request, Response } from "express";
import { ProductModel } from "@api/models";
import { respond } from "@api/utils";
import { TAuthData } from "@shared/types";
import { TMakeProductsUnActive } from "@shared/validations/products";

export const MakeProductsUnActive = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const { productIds } = req.validated?.body as TMakeProductsUnActive;

  try {
    const result = await ProductModel.exists({ _id: { $in: productIds } });
    if (!result) {
      return respond(res, "NOT_FOUND", "No products found to update");
    }

    await ProductModel.updateMany(
      { _id: { $in: productIds } },
      { isActive: false, updatedBy: userId }
    );

    return respond(res, "SUCCESS", "Products updated successfully", {
      data: { result },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Product update failed", {
      errors: { message: (error as Error).message },
    });
  }
};
