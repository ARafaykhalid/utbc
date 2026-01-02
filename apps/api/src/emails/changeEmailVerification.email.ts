import { Resend } from "resend";
import { config } from "@/config";
import { verificationTokenURL } from "@/utils";
import { TOKEN_EXPIRES_MINUTES } from "@shared/constants";
import { maskEmail } from "@/utils";

const resend = new Resend(config.RESEND_API_KEY);

export const sendChangeEmailVerificationEmail = async (
  isEmailVerified: boolean,
  newEmail: string,
  oldEmail: string,
  token: string
) => {
  const resetUrl = verificationTokenURL(
    config.DOMAIN,
    "verification/change-email",
    `token=${token}&email=${encodeURIComponent(
      oldEmail
    )}&newEmail=${encodeURIComponent(newEmail)}`
  );

  const htmlForUnverifiedEmail = `
    <div style="font-family: system-ui, sans-serif; line-height:1.4;">
      <h2>Verify your email</h2>
      <p>Click the link below to verify your email address. The link expires in ${TOKEN_EXPIRES_MINUTES} minutes.</p>
      <p><a href="${resetUrl}">Verify email</a></p>
      <p>If you didn't request this, ignore this email.</p>
    </div>
  `;

  const htmlForVerifiedEmail = `
    <div style="font-family: system-ui, sans-serif; line-height:1.4;">
      <h2>Confirm your new email</h2>
      <p>You're updating your account email to ${newEmail} from ${maskEmail(
    oldEmail
  )}. Please verify it to complete the change. The link expires in ${TOKEN_EXPIRES_MINUTES} minutes.</p>
      <p><a href="${resetUrl}">Confirm new email</a></p>
      <p>If you didn't request this change, ignore this email.</p>
    </div>
  `;

  const emailToOldAddress = `
    <div style="font-family: system-ui, sans-serif; line-height:1.4;">
      <h2>Email change notification</h2>
      <p>Your account email has been changed to ${newEmail}.</p>
      <p>If you didn't make this change, please contact support immediately.</p>
    </div>
  `;

  if (isEmailVerified) {
    await resend.emails.send({
      from: config.FROM_EMAIL,
      to: oldEmail,
      subject: "Your email has been changed",
      html: emailToOldAddress,
    });
  }

  return resend.emails.send({
    from: config.FROM_EMAIL,
    to: newEmail,
    subject: "Verify your email",
    html: isEmailVerified ? htmlForVerifiedEmail : htmlForUnverifiedEmail,
  });
};
