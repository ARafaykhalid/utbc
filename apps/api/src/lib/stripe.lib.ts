import { config } from "@api/config";
import Stripe from "stripe";
import { logger } from "./winston.lib";

if (!config.STRIPE_SECRET_KEY) {
  logger.error("Missing STRIPE_SECRET_KEY env var");
  throw new Error("Missing STRIPE_SECRET_KEY env var");
}

if (!config.STRIPE_WEBHOOK_SECRET) {
  logger.error("Missing STRIPE_WEBHOOK_SECRET env var");
}

export const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
});
