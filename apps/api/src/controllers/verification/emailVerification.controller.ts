import { Request, Response } from "express";
import { UserModel } from "@/models";
import { TEmailVerification } from "@shared/validations";
import { hashToken, respond } from "@/utils";

export const EmailVerification = async (req: Request, res: Response) => {
  const { token, email } = req.validated?.body as TEmailVerification;

  try {
    const hashed = hashToken(token);

    const user = await UserModel.findOne({
      email,
      emailVerificationToken: hashed,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (user?.isEmailVerified) {
      return respond(res, "SUCCESS", "Email is already verified.");
    }

    if (!user) {
      return respond(res, "VALIDATION_ERROR", "Invalid or expired token", {
        errors: { "body.token": "Invalid or expired token" },
      });
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return respond(res, "SUCCESS", "Email verified successfully.");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to verify email", {
      errors: { message: (error as Error).message || "Unknown error" },
    });
  }
};
