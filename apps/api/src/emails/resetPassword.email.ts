import { Resend } from "resend";
import { config } from "@api/config";
import { verificationTokenURL } from "@api/utils";
import { CONFIRMATION_EXPIRY_TIME } from "@shared/constants";

const resend = new Resend(config.RESEND_API_KEY);

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const resetUrl = verificationTokenURL(
    config.DOMAIN,
    "auth/reset-password",
    `token=${token}&email=${encodeURIComponent(to)}`
  );

  const html = `
    <div style="font-family: system-ui, sans-serif; line-height:1.4;">
      <h2>Password reset request</h2>
      <p>We received a request to reset your password. Click the link below to set a new password. The link expires in ${CONFIRMATION_EXPIRY_TIME} minutes.</p>
      <p><a href="${resetUrl}">Reset password</a></p>
      <p>If you didn't request this, ignore this email.</p>
    </div>
  `;

  return resend.emails.send({
    from: config.FROM_EMAIL,
    to,
    subject: "Reset your password",
    html,
  });
};
