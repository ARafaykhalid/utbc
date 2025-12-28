import argon2 from "argon2";
import { getSessionMeta } from "./getSessionMeta";
import { Request } from "express";
import { UserSession } from "@shared/interfaces/sub-interfaces/userSession";

export const createSession = async (
  refreshToken: string,
  user: any,
  req: Request
) => {
  const hashedToken = await argon2.hash(refreshToken);
  const { ip, userAgent } = getSessionMeta(req);
  const deviceExisting = user.sessions?.find(
    (s: UserSession) => s.userAgent?.device === userAgent.device && s.ip === ip
  );

  if (deviceExisting) {
    deviceExisting.token = hashedToken;
    deviceExisting.createdAt = new Date();
    deviceExisting.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  } else {
    user.sessions.push({
      token: hashedToken,
      ip,
      userAgent,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    } as UserSession);
  }

  await user.save();
};
