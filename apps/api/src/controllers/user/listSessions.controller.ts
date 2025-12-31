import { Request, Response } from "express";
import User from "@/models/user.model";
import { respond } from "@/utils/respond.util";
import { TAuthData } from "@/types/userId";

export const ListSessions = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return respond(res, "NOT_FOUND", "User not found", {
        errors: {
          message: "No user found with the provided ID",
        },
      });
    }
    const sessionsExists = user.sessions && user.sessions.length > 0;
    if (!sessionsExists) {
      return respond(res, "SUCCESS", "No active sessions found", {
        data: { sessions: [] },
      });
    }

    const sessions = user.sessions.map((session) => ({
      sessionId: session.sessionId,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    }));

    return respond(res, "SUCCESS", "Sessions fetched successfully", {
      data: { sessions },
    });

  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch sessions", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
