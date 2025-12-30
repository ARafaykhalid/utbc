import { Request, Response } from "express";
import { LogoutFromDevice } from "@shared/validations";
import { respond } from "@/utils/respond";
import { DeleteSession } from "@/utils/deleteSession";
import { Types } from "mongoose";

export const LogoutDevice = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { sessionId } = req.params as LogoutFromDevice as unknown as {
    sessionId: Types.ObjectId;
  };

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
