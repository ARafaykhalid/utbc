import { Request, Response } from "express";
import { respond } from "@/utils/respond.util";
import { generateAccessToken, verifyRefreshToken } from "@/utils/jwtTokens.util";
import userModel from "@/models/user.model";
import { token } from "morgan";
import { JwtPayload } from "@shared/types";

export const RenewAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.signedCookies?.refreshToken;

  try {
    if (!refreshToken) {
      return respond(res, "UNAUTHORIZED", "No refresh token provided", {
        errors: {
          "cookies.refreshToken": "Refresh token is missing",
        },
      });
    }

    const verifyToken = verifyRefreshToken(refreshToken);

    if (!verifyToken) {
      return respond(res, "UNAUTHORIZED", "Invalid refresh token", {
        errors: {
          "cookies.refreshToken": "Refresh token is invalid or expired",
        },
      });
    }

    const user = await userModel.findById(verifyToken._id);
    if (!user) {
      return respond(res, "NOT_FOUND", "User not found", {
        errors: {
          "cookies.refreshToken": "No user associated with this token",
        },
      });
    }

    const sessionMatch = user.sessions.find(
      (session) => session.token === refreshToken
    );
    if (!sessionMatch) {
      return respond(res, "UNAUTHORIZED", "Session not found", {
        errors: {
          "cookies.refreshToken": "No active session for this token",
        },
      });
    }

    if (user.isBlocked) {
      return respond(res, "FORBIDDEN", "User account is blocked");
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      _id: user._id,
      role: user.role,
    } as JwtPayload);

    res.status(200).json({
      status: "SUCCESS",
      message: "Access token renewed successfully",
      data: {
        accessToken: newAccessToken,
      },
    });
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
