import { Types } from "mongoose";

type CartItem = {
  productId: Types.ObjectId;
  variantId?: Types.ObjectId;
  quantity: number;
  price: number;
};

const cartMap = new Map<string, CartItem>();

const key = (productId: Types.ObjectId, variantId?: Types.ObjectId) =>
  `${productId.toString()}:${variantId?.toString() ?? "default"}`;

export const addToCartMap = (item: CartItem) => {
  const k = key(item.productId, item.variantId);

  const existing = cartMap.get(k);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cartMap.set(k, item);
  }
};

export const updateCartMap = (
  productId: Types.ObjectId,
  variantId: Types.ObjectId | undefined,
  quantity: number
) => {
  const k = key(productId, variantId);

  if (!cartMap.has(k)) return;

  quantity <= 0 ? cartMap.delete(k) : (cartMap.get(k)!.quantity = quantity);
};

export const removeFromCartMap = (
  productId: Types.ObjectId,
  variantId?: Types.ObjectId
) => {
  cartMap.delete(key(productId, variantId));
};

export const getCartItems = () => {
  return Array.from(cartMap.values());
};
