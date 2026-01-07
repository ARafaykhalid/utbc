import { z } from "zod";

export const VChangeOrdersStatus = z.object({
  orderIds: z.array(z.string()).min(1, "At least one order ID is required"),
  status: z.enum([
    "processing",
    "pending",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

export type TChangeOrdersStatus = z.infer<typeof VChangeOrdersStatus>;
