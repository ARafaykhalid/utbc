import { ProductImage } from "./productImage.interface";

export interface ProductVariant {
  sku: string;
  price: number;
  stock: number;
  attributes: {
    size?: string;
    color?: string;
    material?: string;
  };
  image: ProductImage;
}
