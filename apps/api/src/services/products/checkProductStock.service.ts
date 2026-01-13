import { ICartItem } from "@api/interfaces";
import { ProductModel, ProductVariantModel } from "@api/models";

export const checkProductStock = async (cartItems: ICartItem[]) => {
  for (const item of cartItems) {
    const qty = Math.max(0, Math.floor(item.quantity ?? 0));
    if (qty <= 0) continue;
    if (item.variant) {
      const variantDoc = await ProductVariantModel.findById(item.variant);
      const productDoc = await ProductModel.findById(item.product);
      if (!variantDoc || !productDoc?.isActive) {
        throw new Error(`One of the product from your cart is not available!`);
      }
      if (typeof variantDoc.stock === "number" && variantDoc.stock < qty) {
        throw new Error(
          `One of the product's stock from was rearragned according to the availabe stock!`
        );
      }
      item.quantity = Math.min(item.quantity ?? 0, variantDoc.stock ?? 0);
    } else {
      const productDoc = await ProductModel.findById(item.product);
      if (!productDoc) {
        throw new Error(`Product not found for ID: ${item.product}`);
      }
      if (typeof productDoc.stock === "number" && productDoc.stock < qty) {
        throw new Error(
          `One of the product's stock from was rearragned according to the availabe stock!`
        );
      }
      item.quantity = Math.min(item.quantity ?? 0, productDoc.stock ?? 0);
    }
  }
};
