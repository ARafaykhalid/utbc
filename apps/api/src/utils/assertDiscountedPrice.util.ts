export const assertDiscount = (price?: number, discountPrice?: number) => {
  if (
    discountPrice !== undefined &&
    price !== undefined &&
    discountPrice > price
  ) {
    throw new Error("discountPrice cannot be greater than price");
  }
};
