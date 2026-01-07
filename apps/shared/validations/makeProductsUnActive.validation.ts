import { z } from "zod";
import { VMakeProductsActive } from "./makeProductsActive.validation";

export const VMakeProductsUnActive = VMakeProductsActive;

export type TMakeProductsUnActive = z.infer<typeof VMakeProductsUnActive>;
