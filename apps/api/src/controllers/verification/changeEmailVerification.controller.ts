import { Request, Response } from "express";
import User from "@/models/user.model";
import { hashToken } from "@/utils/token.util";
import { respond } from "@/utils/respond.util";
import { TChangeEmailVerification } from "@shared/validations/changeEmailVerification.schema";

export const ChangeEmailVerification = async (req: Request, res: Response) => {
  const { token, email, newEmail } = req.body as TChangeEmailVerification;

  try {
    const hashed = hashToken(token);

    const user = await User.findOne({
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
