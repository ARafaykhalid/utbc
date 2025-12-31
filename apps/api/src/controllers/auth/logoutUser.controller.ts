import { Request, Response } from "express";
import { respond } from "@/utils/respond.util";
import { verifyRefreshToken } from "@/utils/jwtTokens.util";
import { DeleteSession } from "@/utils/deleteSession.util";

export const LogoutUser = async (req: Request, res: Response) => {
  const refreshToken = req.signedCookies?.refreshToken;

  try {
    if (!refreshToken) {
      return respond(res, "SUCCESS", "User already logged out");
    }

    const verifiedToken = verifyRefreshToken(refreshToken);

    if (!verifiedToken) {
      return respond(res, "UNAUTHORIZED", "Invalid refresh token", {
        errors: {
          "cookies.refreshToken": "Refresh token is invalid or expired",
        },
      });
    }

    await DeleteSession(verifiedToken._id, verifiedToken.sessionId);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      signed: true,
      secure: process.env.NODE_ENV === "production",
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
