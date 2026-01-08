import z from "zod";

export const VCheckout = z.object({
  shippingAddress: z
    .object({
      fullName: z.string("Full name is required"),
      phone: z.string("Phone is required"),
      street: z.string("Street is required"),
      city: z.string("City is required"),
      state: z.string("State is required"),
      postalCode: z.string("Postal code is required"),
      country: z.string("Country is required"),
    })
    .required(),
  paymentMethod: z.enum(["COD", "STRIPE"]).default("COD"),
  couponCode: z.string().optional(),
});

export type TCheckout = z.infer<typeof VCheckout>;
