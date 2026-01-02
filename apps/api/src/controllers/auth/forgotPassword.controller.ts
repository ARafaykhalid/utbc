import { Request, Response } from "express";
import { UserModel } from "@/models/user.model";
import { respond, token } from "@/utils";
import { sendResetPasswordEmail } from "@/emails";

export const ForgotPassword = async (req: Request, res: Response) => {
  const { email } = req.validated?.body as { email: string };

  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      const { hashedToken, rawToken, tokenExpiresAt } = token();

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = tokenExpiresAt;
      await user.save();

      await sendResetPasswordEmail(email, rawToken);
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
