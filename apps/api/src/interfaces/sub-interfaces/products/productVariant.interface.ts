import { IMedia } from "@/interfaces";

export interface ProductVariant {
  sku: string;
  price: number;
  stock: number;
  attributes: {
    size?: string;
    color?: string;
    material?: string;
  };
  media: IMedia;
}
