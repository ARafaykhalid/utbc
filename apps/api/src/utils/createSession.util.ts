import { Types } from "mongoose";
import { Request } from "express";
import { getSessionMeta } from "./getSessionMeta.util";
import { generateAccessToken, generateRefreshToken } from "./jwtTokens.util";
import { IUserSession } from "@/interfaces/";
import { TJwtPayload } from "@shared/types";

export const createSession = async (user: any, req: Request) => {
  const { ip, userAgent } = getSessionMeta(req);
  const ExistingSession = user.sessions?.find(
    (s: IUserSession) =>
      s.userAgent?.device === userAgent?.device && s.ip === ip
  );

  const sessionId = new Types.ObjectId();
  const refreshToken = generateRefreshToken({
    _id: user._id,
    sessionId,
    role: user.role,
  } as TJwtPayload);

  const accessToken = generateAccessToken({
    _id: user._id,
    sessionId,
    role: user.role,
  } as TJwtPayload);

  if (ExistingSession) {
    ExistingSession.sessionId = sessionId;
    ExistingSession.token = refreshToken;
    ExistingSession.createdAt = new Date();
    ExistingSession.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  } else {
    user.sessions.push({
      sessionId: sessionId,
      token: refreshToken,
      ip,
      userAgent,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    } as IUserSession);
  }

  await user.save();

  return { refreshToken, accessToken };
};
