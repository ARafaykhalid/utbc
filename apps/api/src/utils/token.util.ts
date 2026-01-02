import { TOKEN_EXPIRES_MINUTES } from "@shared/constants";
import crypto from "crypto";

export const genToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const token = () => {
  const rawToken = genToken();
  const hashedToken = hashToken(rawToken);
  const tokenExpiresAt = new Date(
    Date.now() + TOKEN_EXPIRES_MINUTES * 60 * 1000
  );

  return {
    rawToken,
    hashedToken,
    tokenExpiresAt,
  };
};
