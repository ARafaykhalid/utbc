import { CONFIRMATION_EXPIRY_TIME } from "@shared/constants";
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
    Date.now() + CONFIRMATION_EXPIRY_TIME * 60 * 1000
  );

  return {
    rawToken,
    hashedToken,
    tokenExpiresAt,
  };
};
