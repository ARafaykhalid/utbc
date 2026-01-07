import { ICartItem } from "@/interfaces";
import { ProductModel, ProductVariantModel } from "@/models";

export const deStockProduct = async (cartItems: ICartItem[]) => {
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
          `Insufficient stock for the ${
            (variantDoc?.attributes?.size &&
              `Size: ${variantDoc.attributes.size}`) ??
            (variantDoc?.attributes?.color &&
              `Color: ${variantDoc?.attributes?.color}`) ??
            (variantDoc?.attributes?.material &&
              `Material: ${variantDoc?.attributes?.material}`) ??
            ""
          } of ${productDoc?.title}. Available: ${
            variantDoc?.stock
          }, Requested: ${qty}`
        );
      }
      variantDoc.stock = (variantDoc.stock ?? 0) - qty;
      await variantDoc.save();
    } else {
      const productDoc = await ProductModel.findById(item.product);
      if (!productDoc || !productDoc?.isActive) {
        throw new Error(`Product not found for ID: ${item.product}`);
      }
      if (typeof productDoc.stock === "number" && productDoc.stock < qty) {
        throw new Error(
          `Insufficient stock for product: ${productDoc.title}. Available: ${productDoc.stock}, Requested: ${qty}`
        );
      }
      productDoc.stock = (productDoc.stock ?? 0) - qty;
      await productDoc.save();
    }
  }
};
