import { Request, Response } from "express";
import { TAuthData } from "@shared/types";
import { TRevokeSession } from "@shared/validations/settings";
import { respond } from "@/utils";
import { deleteSession } from "@/services/sessions";

export const RevokeSession = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const { sessionId } = req.validated?.params as TRevokeSession;

  try {
    if (!sessionId) {
      return respond(res, "BAD_REQUEST", "Device ID is required", {
        errors: { "params.sessionId": "Device ID is missing" },
      });
    }

    await deleteSession(userId, sessionId);

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
