import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "@api/models";
import { respond, verifyAccessToken } from "@api/utils";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  const { _id: userId, sessionId, role } = payload;

  const user = await UserModel.findOne({ _id: userId, role }).select(
    "sessions isBlocked"
  );

  if (!user) {
    return respond(res, "JWT_INVALID", "User not found");
  }

  if (user.isBlocked) {
    return respond(res, "FORBIDDEN", "User account is blocked");
  }

  const sessionExists = user.sessions?.some((session) =>
    session._id.equals(sessionId)
  );

  if (!sessionExists) {
    return respond(res, "JWT_INVALID", "Session expired or logged out");
  }

  // attach trusted data
  req.user = {
    userId,
    sessionId,
    userRole: role,
  };

  next();
};
