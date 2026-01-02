import mongoose, { ConnectOptions } from "mongoose";
import { config } from "@/config";
import { logger } from "@/lib/winston.lib";

const clientOptions: ConnectOptions = {
  dbName: config.MONGO_DB_NAME,
  appName: config.MONGO_APP_NAME,
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

export const connectDatabase = async () => {
  if (!config.MONGO_URI) {
    throw new Error("MongoDB URI doesnt exists or not declared in config!");
  }
  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    logger.info("MongoDB Connected Successfully", {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    logger.error("Error During Connecting:", err);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();

    logger.info("MongoDB Disconnected Successfully", {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    logger.error("Error During Disconnecting:", err);
    process.exit(1);
  }
};
