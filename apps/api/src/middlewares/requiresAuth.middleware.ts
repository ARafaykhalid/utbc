import { Request, Response, NextFunction } from "express";
import { respond } from "@/utils/respond.util";
import { verifyAccessToken } from "@/utils/jwtTokens.util";
import userModel from "@/models/user.model";

export const RequireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return respond(res, "UNAUTHORIZED", "Authorization token missing");
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyAccessToken(token);
    if (!payload) {
      return respond(res, "UNAUTHORIZED", "Invalid or expired token");
    }

    const { _id: userId, sessionId } = payload;
    console.log("Payload in requireAuth:", payload);

    const user = await userModel.findById(userId).select("sessions isBlocked");
    if (!user) {
      return respond(res, "UNAUTHORIZED", "User no longer exists");
    }

    if (user.isBlocked) {
      return respond(res, "FORBIDDEN", "User account is blocked");
    }

    const sessionExists = user.sessions?.some((s) =>
      s.sessionId.equals(sessionId)
    );

    if (!sessionExists) {
      return respond(res, "UNAUTHORIZED", "Session expired or logged out");
    }

    // attach trusted data
    req.user = {
      userId,
      sessionId,
    };

    next();
  } catch (error) {
    return respond(res, "UNAUTHORIZED", "Authentication failed", {
      errors: {
        message: (error as Error).message,
      },
    });
  }
};
