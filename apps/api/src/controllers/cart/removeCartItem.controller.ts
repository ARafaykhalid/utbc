import { Request, Response } from "express";
import { CartModel } from "@/models";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { TRemoveFromCart } from "@shared/validations";

export const RemoveCartItem = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const { productId, variantId } = req.validated?.body as TRemoveFromCart;

  try {
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      return respond(res, "NOT_FOUND", "Cart not found");
    }

    const initialLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId.toString() &&
          (item.variant ? item.variant.toString() : "") ===
            (variantId ? variantId.toString() : "")
        )
    );

    if (cart.items.length === initialLength) {
      return respond(res, "NOT_FOUND", "Cart item not found");
    }

    // Recalculate totals
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    cart.total = Math.max(cart.subtotal - cart.discount, 0);

    await cart.save();

    return respond(res, "SUCCESS", "Item removed from cart", {
      data: { cart },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to remove item", {
      errors: { message: (error as Error).message },
    });
  }
};
