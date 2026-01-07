import { Request, Response } from "express";
import { CartModel } from "@/models";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";

export const GetCart = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;

  try {
    const cart = await CartModel.findOne({ user: userId })
      .populate({
        path: "items.product",
        select: "title slug",
        populate: {
          path: "media",
          model: "Media",
          select: "url type",
        },
      })
      .populate({
        path: "items.variant",
        model: "ProductVariant",
        select: "sku price stock attributes",
      })
      .populate({
        path: "items.media",
        model: "Media",
        select: "url type -_id",
      });
      
    if (!cart || cart.items.length === 0) {
      return respond(res, "SUCCESS", "Cart is empty", { data: null });
    }

    return respond(res, "SUCCESS", "Cart fetched", { data: cart });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to get cart", {
      errors: { message: (error as Error).message },
    });
  }
};
