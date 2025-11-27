import { config } from "@/config";
import winston from "winston";

const { timestamp, errors, json, combine, align, printf, colorize } =
  winston.format;
const transports: winston.transport[] = [];

if (config.NODE_ENV != "production") {
  transports.push(
    new winston.transports.Console({
      format: combine(
        timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
        colorize({ all: true }),
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr =
            Object.keys(meta).length && `\n ${JSON.stringify(meta)}`;
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        })
      ),
    })
  );
}

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  silent: config.NODE_ENV == "test",
});
