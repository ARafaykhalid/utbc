import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { respond, verifyRefreshToken } from "@api/utils";
import { config } from "@api/config";
import { deleteSession } from "@api/services/sessions";

export const LogoutUser = async (req: Request, res: Response) => {
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

    await deleteSession(verifiedToken._id, verifiedToken.sessionId);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      signed: true,
      secure: config.NODE_ENV === "production",
    });

    return respond(res, "SUCCESS", "User logged out successfully");
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
