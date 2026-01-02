import { Request, Response } from "express";
import { TAuthData } from "@shared/types";
import { TRevokeSession } from "@shared/validations";
import { Types } from "mongoose";
import { deleteSession, respond } from "@/utils";

export const RevokeSession = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const { sessionId } = req.params as TRevokeSession;

  try {
    if (!sessionId) {
      return respond(res, "BAD_REQUEST", "Device ID is required", {
        errors: { "params.sessionId": "Device ID is missing" },
      });
    }

    await deleteSession(userId, new Types.ObjectId(sessionId));

    return respond(res, "SUCCESS", "Logged out from device successfully");
  } catch (error) {
    return respond(
      res,
      "INTERNAL_SERVER_ERROR",
      "An error occurred during login",
      {
        errors: {
          message: (error as Error).message || "Unknown error",
        },
      }
    );
  }
};
