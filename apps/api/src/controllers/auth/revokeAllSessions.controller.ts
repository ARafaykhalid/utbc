import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "@/config";
import { respond, verifyRefreshToken } from "@/utils";
import { UserModel } from "@/models";

export const RevokeAllSessions = async (req: Request, res: Response) => {
  const refreshToken = req.signedCookies?.refreshToken;
  let verifiedToken: any;

  try {
    if (!refreshToken) {
      return respond(res, "SUCCESS", "User already logged out");
    }

    try {
      verifiedToken = verifyRefreshToken(refreshToken);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return respond(res, "JWT_EXPIRED", "Access token expired");
      }

      if (err instanceof jwt.JsonWebTokenError) {
        return respond(res, "JWT_INVALID", "Invalid access token");
      }

      return respond(res, "UNAUTHORIZED", "Authentication failed");
    }

    if (!verifiedToken) {
      return respond(res, "UNAUTHORIZED", "Invalid refresh token", {
        errors: {
          "cookies.refreshToken": "Refresh token is invalid or expired",
        },
      });
    }

    await UserModel.updateOne(
      { _id: verifiedToken._id },
      { $set: { sessions: [] } }
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      signed: true,
      secure: config.NODE_ENV === "production",
    });

    return respond(res, "SUCCESS", "All Sessions revoked successfully");
  } catch (error) {
    return respond(
      res,
      "INTERNAL_SERVER_ERROR",
      "Failed to revoke all sessions",
      {
        errors: {
          message: (error as Error).message || "Unknown error",
        },
      }
    );
  }
};
