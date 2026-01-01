import { Request, Response, NextFunction } from "express";
import { respond } from "@/utils/respond.util";
import { verifyAccessToken } from "@/utils/jwtTokens.util";
import userModel from "@/models/user.model";
import jwt from "jsonwebtoken";

export const RequireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return respond(res, "JWT_MISSING", "Authorization token missing");
    }

    const token = authHeader.split(" ")[1];
    let payload: any;

    try {
      payload = verifyAccessToken(token);

    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return respond(res, "JWT_EXPIRED", "Access token expired");
      }

      if (err instanceof jwt.JsonWebTokenError) {
        return respond(res, "JWT_INVALID", "Invalid access token");
      }

      return respond(res, "UNAUTHORIZED", "Authentication failed");
    }

    const { _id: userId, sessionId } = payload;

    const user = await userModel.findById(userId).select("sessions isBlocked");
    if (!user) {
      return respond(res, "JWT_INVALID", "User no longer exists");
    }

    if (user.isBlocked) {
      return respond(res, "FORBIDDEN", "User account is blocked");
    }

    const sessionExists = user.sessions?.some((s) =>
      s.sessionId.equals(sessionId)
    );

    if (!sessionExists) {
      return respond(res, "JWT_INVALID", "Session expired or logged out");
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
