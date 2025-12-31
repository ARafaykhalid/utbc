import { Request, Response } from "express";
import { respond } from "@/utils/respond.util";
import { DeleteSession } from "@/utils/deleteSession.util";
import { TAuthData } from "@/types/userId";

export const RevokeSession = async (req: Request, res: Response) => {
  const { userId, sessionId } = req.user as TAuthData;

  try {
    if (!sessionId) {
      return respond(res, "BAD_REQUEST", "Device ID is required", {
        errors: { "params.sessionId": "Device ID is missing" },
      });
    }

    await DeleteSession(userId, sessionId);

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
