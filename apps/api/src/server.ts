import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes";
import { config } from "./config";
import { limiter } from "./lib/expressRateLimiter";
import { CorsOptionsSettings } from "./lib/corsOptions";
import compression from "compression";
import { connectDatabase, disconnectDatabase } from "./lib/mongoose";
import { logger } from "./lib/winston";
import { express as useragent } from "express-useragent";
const app = express();

/* ---------- Middlewares ---------- */
// CORS for Next.js frontend (localhost:3000 or production domain)
app.use(cors(CorsOptionsSettings));

// User Agent Parser
app.use(useragent());

// JSON body parsing
app.use(express.json());

// For Rich Control
app.use(express.urlencoded({ extended: true }));

// Helmet for security headers (with relaxed CSP for Next.js)
app.use(helmet());

// For spam
app.use(limiter);

// Morgan for request logging (only in development)
if (config.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

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
    app.use("/api", router);

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
