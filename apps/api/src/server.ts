import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { express as useragent } from "express-useragent";
import { config } from "./config";
import {
  connectDatabase,
  corsOptionsSettings,
  disconnectDatabase, 
  limiter,
  logger,
} from "./lib";
import { jsonParseErrorHandler } from "./middlewares";
import WebhookRoute from "./routes/webhooks";
import APIRoute from "./routes/api";

const app = express();

/* ---------- Middlewares ---------- */
// CORS for Next.js frontend (localhost:3000 or production domain)
app.use(cors(corsOptionsSettings));

// Morgan for request logging (only in development)
if (config.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Trust proxy (for correct IP address and protocol detection behind proxies)
// app.set("trust proxy", true);

// User Agent Parser
app.use(useragent());

// Helmet for security headers (with relaxed CSP for Next.js)
app.use(helmet());

// For spam
app.use(limiter);

// --- Mount webhook BEFORE express.json() so Stripe signature works ---
app.use("/webhook", WebhookRoute);

// JSON body parsing
app.use(express.json());
app.use(jsonParseErrorHandler);

// For Rich Control
app.use(express.urlencoded({ extended: true }));

// Cookie parser (for signed cookies, like refreshToken)
app.use(cookieParser(config.COOKIE_SECRET));

// For Performance
app.use(compression({ threshold: 1024 }));

/* ---------- Start Server ---------- */
(async () => {
  try {
    /* ---------- Connecting to Database ---------- */
    await connectDatabase();

    /* ---------- Routes ---------- */
    app.use("/api", APIRoute);

    app.listen(config.PORT, async () => {
      logger.info(`Server running on http://localhost:${config.PORT}`);
    });
  } catch (err) {
    logger.error("Failed to start the server!", err);
    if (config.NODE_ENV == "production") {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectDatabase();
    logger.info("Server Shutting Down!");
    process.exit(0);
  } catch (err) {
    logger.error("Error during the Shutdown", err);
  }
};

process.on("SIGTERM", handleServerShutdown);
process.on("SIGINT", handleServerShutdown);
