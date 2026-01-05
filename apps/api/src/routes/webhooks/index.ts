import { Router } from "express";
import { StripeWebhook } from "@/controllers/webhooks";
import express from "express";

const WebhookRoute: Router = Router();

WebhookRoute.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  StripeWebhook
);

export default WebhookRoute;
