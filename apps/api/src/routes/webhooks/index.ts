import { Router } from "express";
import { StripeWebhook } from "@/controllers/webhooks";
import express from "express";
import { requireAuth } from "@/middlewares";

const WebhookRoute: Router = Router();

WebhookRoute.post(
  "/stripe",
  requireAuth,
  express.raw({ type: "application/json" }),
  StripeWebhook
);

export default WebhookRoute;
