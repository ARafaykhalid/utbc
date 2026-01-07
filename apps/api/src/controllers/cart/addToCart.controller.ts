import { Request, Response } from "express";
import { CartModel, ProductModel, ProductVariantModel } from "@/models";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { TAddToCart } from "@shared/validations";

export const AddToCart = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const {
    productId,
    variantId,
    quantity = 1,
  } = req.validated?.body as TAddToCart;

  try {
    if (quantity < 1) {
      return respond(res, "BAD_REQUEST", "Quantity must be at least 1");
    }

    const product = await ProductModel.findById(productId).lean();
    if (!product || !product.isActive) {
      return respond(res, "NOT_FOUND", "Product not available");
    }
    
    if (product.variants && product.variants.length > 0 && !variantId) {
      return respond(res, "BAD_REQUEST", "Product variant is required");
    }

    let price = product.discountedPrice ?? product.price;
    let media = product.media[0];

    // Variant handling
    if (variantId) {
      const variant = await ProductVariantModel.findById(variantId);

      if (!variant) {
        return respond(res, "BAD_REQUEST", "Invalid product variant");
      }

      price = variant.price ?? variant.discountedPrice;
      media = variant.media;
    }

    // Atomic cart upsert
    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      await CartModel.create({
        user: userId,
        items: [
          {
            product: product._id,
            variant: variantId,
            quantity,
            price,
            title: product.title,
            media,
          },
        ],
        subtotal: price * quantity,
        total: price * quantity,
      });

      return respond(res, "SUCCESS", "Added to cart");
    }

    // Check if item already exists
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId.toString() &&
        (item.variant ? item.variant.toString() : "") ===
          (variantId ? variantId.toString() : "")
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        variant: variantId,
        quantity,
        price,
        title: product.title,
        media,
      });
    }

    // Recalculate totals
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    cart.total = Math.max(cart.subtotal - cart.discount, 0);

    await cart.save();

    return respond(res, "SUCCESS", "Added to cart", {
      data: { cart },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to add to cart", {
      errors: { message: (error as Error).message },
    });
  }
};
