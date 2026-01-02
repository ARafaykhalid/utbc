import { Resend } from "resend";
import { config } from "@/config";
import { verificationTokenURL } from "@/utils";
import { TOKEN_EXPIRES_MINUTES } from "@shared/constants";

const resend = new Resend(config.RESEND_API_KEY);

export const sendEmailVerificationEmail = async (to: string, token: string) => {
  const resetUrl = verificationTokenURL(
    config.DOMAIN,
    "verification/verify-email",
    `token=${token}&email=${encodeURIComponent(to)}`
  );

  const html = `
    <div style="font-family: system-ui, sans-serif; line-height:1.4;">
      <h2>Verify your email</h2>
      <p>Click the link below to verify your email address. The link expires in ${TOKEN_EXPIRES_MINUTES} minutes.</p>
      <p><a href="${resetUrl}">Verify email</a></p>
      <p>If you didn't request this, ignore this email.</p>
    </div>
  `;

  return resend.emails.send({
    from: config.FROM_EMAIL,
    to,
    subject: "Verify your email",
    html,
  });
};
