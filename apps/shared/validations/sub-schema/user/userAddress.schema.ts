import z from "zod";

export const UserAddressSchema = z.object({
  name: z.string("Name is required").min(1, "Name is required"),
  address: z.object({
    fullName: z.string("Full name is required").optional(),
    phone: z.string("Phone is required").optional(),
    street: z.string("Street is required").optional(),
    city: z.string("City is required").optional(),
    state: z.string("State is required").optional(),
    postalCode: z.string("Postal code is required").optional(),
    country: z.string("Country is required").optional(),
  }),
});
