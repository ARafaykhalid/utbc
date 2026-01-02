import { IUserSession } from "@/interfaces/";
import { Request } from "express";
import geoip from "geoip-lite";

export const getSessionMeta = (req: Request) => {
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket.remoteAddress;

  const geo = ip ? geoip.lookup(ip) : null;

  return {
    ip: ip ?? null,
    userAgent: {
      browser: req.useragent?.browser ?? "unknown",
      os: req.useragent?.os ?? "unknown",
      device: req.useragent?.platform ?? "unknown",
    },
    location: {
      country: geo?.country ?? "unknown",
      city: geo?.city ?? "unknown",
    },
  } as Partial<IUserSession>;
};
