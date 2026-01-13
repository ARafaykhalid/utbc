import { Router } from "express";
import { StripeWebhook } from "@api/controllers/webhooks";
import express from "express";
import { requireAuth } from "@api/middlewares";

const WebhookRoute: Router = Router();

WebhookRoute.post(
  "/stripe",
  requireAuth,
  express.raw({ type: "application/json" }),
  StripeWebhook
);

export default WebhookRoute;
