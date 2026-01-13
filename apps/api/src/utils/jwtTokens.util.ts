import { config } from "@api/config";
import { TJwtPayload } from "@shared/types";
import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: TJwtPayload) => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: "15m",
    subject: "accessToken",
  });
};

export const generateRefreshToken = (payload: TJwtPayload) => {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
    subject: "refreshToken",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.JWT_SECRET) as TJwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as TJwtPayload;
};
