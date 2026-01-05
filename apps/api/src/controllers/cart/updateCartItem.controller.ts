import { Request, Response } from "express";
import { CartModel, ProductModel } from "@/models";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { TUpdateCartItem } from "@shared/validations";

export const UpdateCartItem = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const { productId, variantId, quantity } = req.validated
    ?.body as TUpdateCartItem;

  try {
    if (quantity < 0) {
      return respond(res, "BAD_REQUEST", "Quantity cannot be negative");
    }

    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      return respond(res, "NOT_FOUND", "Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId.toString() &&
        (item.variant ? item.variant.toString() : "") ===
          (variantId ? variantId.toString() : "")
    );

    if (itemIndex === -1) {
      return respond(res, "NOT_FOUND", "Cart item not found");
    }

    // Remove item if quantity = 0
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate totals
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    cart.total = Math.max(cart.subtotal - cart.discount, 0);

    await cart.save();

    return respond(res, "SUCCESS", "Cart updated successfully", {
      data: { cart },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to update cart", {
      errors: { message: (error as Error).message },
    });
  }
};
