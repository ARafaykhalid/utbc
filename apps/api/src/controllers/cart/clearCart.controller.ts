import { Request, Response } from "express";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { CartModel } from "@/models";

export const ClearCart = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;

  try {
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      return respond(res, "NOT_FOUND", "Cart not found");
    }
    if (cart.items.length === 0) {
      return respond(res, "BAD_REQUEST", "Cart is already empty");
    }
    
    cart.items = [];
    cart.subtotal = 0;
    cart.discount = 0;
    cart.total = 0;
    await cart.save();

    return respond(res, "SUCCESS", "Cart cleared successfully", {
      data: { cart },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to clear cart", {
      errors: { message: (error as Error).message },
    });
  }
};
