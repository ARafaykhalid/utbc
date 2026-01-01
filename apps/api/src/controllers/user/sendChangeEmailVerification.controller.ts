import { Request, Response } from "express";
import { respond } from "@/utils/respond.util";
import userModel from "@/models/user.model";
import { TAuthData } from "@/types/userId";
import { Token } from "@/utils/token.util";
import { SendChangeEmailVerificationEmail } from "@/emails/changeEmailVerification.email";

export const SendChangeEmailVerification = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.user as TAuthData;
  const { newEmail } = req.body;

  try {
    const user = await userModel.findById(userId).select("-password -sessions");
    if (!user) {
      return respond(res, "NOT_FOUND", "User not found", {
        errors: {
          message: "No user found with the provided ID",
        },
      });
    }

    const existing = await userModel.findOne({ email: newEmail });
    if (existing) {
      return respond(res, "CONFLICT", "Email is already in use", {
        errors: {
          "body.newEmail": "Email is already in use",
        },
      });
    }

    const { hashedToken, rawToken, tokenExpiresAt } = Token();

    user.newEmail = newEmail;
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = tokenExpiresAt;
    await user.save();

    await SendChangeEmailVerificationEmail(
      user.isEmailVerified,
      newEmail,
      user.email,
      rawToken
    );

    return respond(res, "SUCCESS", "Verification email sent successfully.");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to change email", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
