import { HydratedDocument, Types } from "mongoose";
import { Request } from "express";
import { IUser, IUserSession } from "@/interfaces/";
import { TJwtPayload } from "@shared/types";
import { generateAccessToken, generateRefreshToken, getSessionMeta } from "@/utils";

export const createSession = async (
  user: HydratedDocument<IUser>,
  req: Request
) => {
  const { ip, userAgent, location } = getSessionMeta(req);
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

  console.log("location:", location);

  if (ExistingSession) {
    ExistingSession._id = sessionId;
    ExistingSession.token = refreshToken;
    ExistingSession.createdAt = new Date();
    ExistingSession.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  } else {
    user.sessions.push({
      _id: sessionId,
      token: refreshToken,
      ip,
      userAgent,
      location,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    } as IUserSession);
  }

  await user.save();

  return { refreshToken, accessToken };
};
