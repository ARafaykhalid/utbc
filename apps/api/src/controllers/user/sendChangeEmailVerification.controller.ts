import { Request, Response } from "express";
import { UserModel } from "@/models";
import { TAuthData } from "@shared/types";
import { sendChangeEmailVerificationEmail } from "@/emails";
import { respond, token } from "@/utils";
import { TSendChangeEmailVerification } from "@shared/validations";

export const SendChangeEmailVerification = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.user as TAuthData;
  const { newEmail } = req.validated?.body as TSendChangeEmailVerification;

  try {
    const user = await UserModel.findById(userId).select("-password -sessions");
    if (!user) {
      return respond(res, "NOT_FOUND", "User not found", {
        errors: {
          message: "No user found with the provided ID",
        },
      });
    }

    const existing = await UserModel.findOne({ email: newEmail });
    if (existing) {
      return respond(res, "CONFLICT", "Email is already in use", {
        errors: {
          "body.newEmail": "Email is already in use",
        },
      });
    }

    const { hashedToken, rawToken, tokenExpiresAt } = token();

    user.newEmail = newEmail;
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = tokenExpiresAt;
    await user.save();

    await sendChangeEmailVerificationEmail(
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
