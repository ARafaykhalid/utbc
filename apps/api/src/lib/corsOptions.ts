import { CorsOptions } from "cors";
import { config } from "@/config";
import { logger } from "./winston";

export const CorsOptionsSettings: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV == "development" ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error: ${origin} not allowed!`), false);
      logger.warn(`CORS Error: ${origin} not allowed!`);
    }
  },
  credentials: true,
};
