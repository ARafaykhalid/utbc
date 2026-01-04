import { TFilterArg } from "@shared/types";
import { Types } from "mongoose";

export const normalizeFilter = (prop?: TFilterArg): Record<string, any> => {
  if (!prop) return {};
  if (prop instanceof Types.ObjectId) return { _id: prop };
  if (typeof prop === "string") {
    if (Types.ObjectId.isValid(prop)) return { _id: new Types.ObjectId(prop) };
    return { slug: prop };
  }
  return prop as Record<string, any>;
};