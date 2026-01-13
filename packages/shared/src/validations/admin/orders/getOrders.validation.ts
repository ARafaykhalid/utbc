import { z } from "zod";

export const VGetOrders = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(200).optional().default(20),

  sortBy: z
    .enum(["createdAt", "total", "deliveryStatus", "paymentStatus"])
    .optional()
    .default("createdAt"),

  order: z
    .enum(["asc", "desc"])
    .default("desc")
    .transform((val) => (val === "asc" ? 1 : -1)),

  search: z.string().min(1).optional(),

  deliveryStatus: z
    .enum(["processing", "pending", "shipped", "delivered", "cancelled"])
    .optional(),

  paymentStatus: z
    .enum([
      "pending confirmation",
      "pending payment",
      "confirmed",
      "paid",
      "asked for refund",
      "refunded",
    ])
    .optional(),

  paymentMethod: z.enum(["STRIPE", "COD"]).optional(),

  from: z.preprocess(
    (v) => (v ? new Date(String(v)) : undefined),
    z.date().optional()
  ),
  to: z.preprocess(
    (v) => (v ? new Date(String(v)) : undefined),
    z.date().optional()
  ),
});

export type TGetOrders = z.infer<typeof VGetOrders>;
