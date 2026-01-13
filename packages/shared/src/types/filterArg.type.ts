import { Types } from "mongoose";

export type TFilterArg = Record<string, any> | Types.ObjectId | string;
