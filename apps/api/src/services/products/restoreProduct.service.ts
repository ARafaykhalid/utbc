import { ICartItem } from "@/interfaces";
import { ProductModel, ProductVariantModel } from "@/models";

export const restoreProduct = async (cartItems: ICartItem[]) => {
  for (const item of cartItems) {
    const qty = Math.max(0, Math.floor(item.quantity ?? 0));
    if (qty <= 0) continue;
    if (item.variant) {
      const variantDoc = await ProductVariantModel.findById(item.variant);
      const productDoc = await ProductModel.findById(item.product);
      if (!variantDoc || !productDoc?.isActive) {
        throw new Error(`One of the product from your cart is not available!`);
      }
      variantDoc.stock = (variantDoc.stock ?? 0) + qty;
      await variantDoc.save();
    } else {
      const productDoc = await ProductModel.findById(item.product);
      if (!productDoc || !productDoc?.isActive) {
        throw new Error(`One of the product from your cart is not available!`);
      }
      productDoc.stock = (productDoc.stock ?? 0) + qty;
      await productDoc.save();
    }
  }
};
