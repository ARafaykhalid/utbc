import { Request, Response } from "express";
import argon2 from "argon2";
import { userRegistration } from "@shared/validations";
import { respond } from "@/utils/respond";
import userModel from "@/models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
} from "@/utils/jwtTokens";
import { createSession } from "@/utils/createSession";
import { JwtPayload } from "@shared/types";

export const LoginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body as userRegistration;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return respond(res, "NOT_FOUND", "User does not exist with this email", {
        errors: {
          "body.email": "Email not found",
        },
      });
    }

    const userPassword = await argon2.hash(user.password);
    const mathPassword = await argon2.verify(userPassword, password);

    if (!mathPassword) {
      return respond(res, "UNAUTHORIZED", "Incorrect password", {
        errors: {
          "body.password": "Password is incorrect",
        },
      });
    }

    if (user.isBlocked) {
      return respond(res, "FORBIDDEN", "User account is blocked");
    }

    const refreshToken = generateRefreshToken({
      _id: user._id,
      role: user.role,
    } as JwtPayload);

    await createSession(refreshToken, user, req);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      signed: true,
    });

    return respond(res, "SUCCESS", "User logged in successfully", {
      data: { email: user.email, name: user.name },
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
