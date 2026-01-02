import { Request, Response } from "express";
import argon2 from "argon2";
import { TResetPassword } from "@shared/validations";
import { UserModel } from "@/models";
import { hashToken, respond } from "@/utils";

export const ResetPassword = async (req: Request, res: Response) => {
  const { token, email, password } = req.validated?.body as TResetPassword;

  try {
    const hashed = hashToken(token);

    const user = await UserModel.findOne({
      email,
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return respond(res, "VALIDATION_ERROR", "Invalid or expired token", {
        errors: { "body.token": "Invalid or expired token" },
      });
    }

    const hashedPassword = await argon2.hash(password);
    user.password = hashedPassword;

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return respond(
      res,
      "SUCCESS",
      "Password reset successfully, You can now log in."
    );
  } catch (error) {
    console.error(error);
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to reset password", {
      errors: { message: (error as Error).message || "Unknown error" },
    });
  }
};
