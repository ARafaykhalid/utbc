import { Request } from "express";

export const getSessionMeta = (req: Request) => {
  return {
    ip: req.clientIp ?? null,
    userAgent: {
      browser: req.useragent?.browser ?? "unknown",
      os: req.useragent?.os ?? "unknown",
      device: req.useragent?.platform ?? "unknown",
    },
  };
};
