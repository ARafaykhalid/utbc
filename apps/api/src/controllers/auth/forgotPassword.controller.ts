import { Request, Response } from "express";
import User from "@/models/user.model";
import { genToken, hashToken, Token } from "@/utils/token.util";
import { respond } from "@/utils/respond.util";
import { ResetPasswordEmail } from "@/emails/resetPassword.email";

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };

  try {
    const user = await User.findOne({ email });

    if (user) {
      const { hashedToken, rawToken, tokenExpiresAt } = Token();

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = tokenExpiresAt;
      await user.save();

      await ResetPasswordEmail(email, rawToken);
    }

    return respond(
      res,
      "SUCCESS",
      "If an account with that email exists, a reset link has been sent."
    );
  } catch (error) {
    return respond(
      res,
      "INTERNAL_SERVER_ERROR",
      "Failed to request password reset",
      {
        errors: { message: (error as Error).message || "Unknown error" },
      }
    );
  }
};
