import { Types } from "mongoose";
import { ValidatedData } from "@shared/types";

declare module "express" {
  interface Request {
    useragent?: {
      browser?: string;
      os?: string;
      platform?: string;
    };
    clientIp?: string;

    user?: {
      userId: Types.ObjectId;
      sessionId: Types.ObjectId;
      userRole: string;
    };
    validated?: Partial<ValidatedData<any, any, any>>;
  }
}
