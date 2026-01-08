import { Request, Response } from "express";
import { UserModel } from "@/models";
import { hashToken, respond } from "@/utils";
import { TChangeEmailVerification } from "@shared/validations/email/verification";

export const ChangeEmailVerification = async (req: Request, res: Response) => {
  const { token, email, newEmail } = req.validated
    ?.body as TChangeEmailVerification;

  try {
    const hashed = hashToken(token);

    const user = await UserModel.findOne({
      email,
      newEmail: newEmail,
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

    user.sessions = [];
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return respond(
      res,
      "SUCCESS",
      "Email verified successfully. Login again to continue."
    );
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to change email", {
      errors: { message: (error as Error).message || "Unknown error" },
    });
  }
};
