import { Request, Response } from "express";
import { Token } from "@/utils/token.util";
import { respond } from "@/utils/respond.util";
import userModel from "@/models/user.model";
import { SendEmailVerificationEmail } from "@/emails/emailVerification.email";
import { TAuthData } from "@/types/userId";

export const SendEmailVerification = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;

  try {
    const user = await userModel.findById(userId);
    console.log("User found for email verification:", userId);

    if (!user) {
      return respond(res, "VALIDATION_ERROR", "Invalid or expired token", {
        errors: { "body.token": "Invalid or expired token" },
      });
    }

    if (user.isEmailVerified) {
      return respond(res, "SUCCESS", "Email is already verified.");
    }

    const { hashedToken, rawToken, tokenExpiresAt } = Token();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = tokenExpiresAt;
    await user.save();

    await SendEmailVerificationEmail(user.email, rawToken);

    return respond(res, "SUCCESS", "Verification email sent successfully.");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to verify email", {
      errors: { message: (error as Error).message || "Unknown error" },
    });
  }
};
