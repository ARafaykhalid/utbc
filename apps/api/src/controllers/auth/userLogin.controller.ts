import { Request, Response } from "express";
import argon2 from "argon2";
import { TUserLogin } from "@shared/validations/auth";
import { config } from "@api/config";
import { UserModel } from "@api/models";
import { respond } from "@api/utils";
import { createSession } from "@api/services/sessions";

export const LoginUser = async (req: Request, res: Response) => {
  const { email, password } = req.validated?.body as TUserLogin;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return respond(res, "NOT_FOUND", "User does not exist with this email", {
        errors: {
          "body.email": "Email not found",
        },
      });
    }

    const mathPassword = await argon2.verify(user.password, password);

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

    const { refreshToken, accessToken } = await createSession(user, req);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      signed: true,
    });

    return respond(res, "SUCCESS", "User logged in successfully", {
      data: { email: user.email, name: user.name, accessToken: accessToken },
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
