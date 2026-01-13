import { Request, Response } from "express";
import { UserModel } from "@api/models";
import { sendEmailVerificationEmail } from "@api/emails";
import { TAuthData } from "@shared/types";
import { respond, token } from "@api/utils";

export const SendEmailVerification = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;

  try {
    const user = await UserModel.findById(userId);
    console.log("User found for email verification:", userId);

    if (!user) {
      return respond(res, "VALIDATION_ERROR", "Invalid or expired token", {
        errors: { "body.token": "Invalid or expired token" },
      });
    }

    if (user.isEmailVerified) {
      return respond(res, "SUCCESS", "Email is already verified.");
    }

    const { hashedToken, rawToken, tokenExpiresAt } = token();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = tokenExpiresAt;
    await user.save();

    await sendEmailVerificationEmail(user.email, rawToken);

    return respond(res, "SUCCESS", "Verification email sent successfully.");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to verify email", {
      errors: { message: (error as Error).message || "Unknown error" },
    });
  }
};
