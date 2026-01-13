import { IProduct } from "@api/interfaces";

type SortType = "price" | "rating" | "latest" | "alphabetical";

export const sortProducts = (
  products: IProduct[],
  sortBy: SortType,
  order: "asc" | "desc" = "asc"
): IProduct[] => {
  const sorted = [...products];

  const multiplier = order === "asc" ? 1 : -1;

  sorted.sort((a, b) => {
    switch (sortBy) {
      case "price":
        return (a.price - b.price) * multiplier;

      case "rating":
        return (
          ((a.ratings?.average ?? 0) - (b.ratings?.average ?? 0)) * multiplier
        );

      case "alphabetical":
        return a.title.localeCompare(b.title) * multiplier;

      case "latest":
        return (
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
          multiplier
        );

      default:
        return 0;
    }
  });

  return sorted;
};
