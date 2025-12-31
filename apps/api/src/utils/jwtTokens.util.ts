import { config } from "@/config";
import { JwtPayload } from "@shared/types";
import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: "15m",
    subject: "accessToken",
  });
};

export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
    subject: "refreshToken",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as JwtPayload;
};

// export const verifyAccessTokenOrRespond = (
//   token: string | undefined | null,
//   res: Response
// ): JwtPayload | null => {
//   if (!token) {
//     respond(res, "JWT_MISSING", "Authentication token is required");
//     return null;
//   }

//   try {
//     const payload = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
//     return payload;
//   } catch (err: any) {
//     // jwt TokenExpiredError or JsonWebTokenError
//     if (err && err.name === "TokenExpiredError") {
//       respond(res, "JWT_EXPIRED", "Access token expired, please login again");
//       return null;
//     }

//     respond(res, "JWT_INVALID", "Invalid authentication token");
//     return null;
//   }
// };

// export const verifyRefreshTokenOrRespond = (
//   token: string | undefined | null,
//   res: Response
// ): JwtPayload | null => {
//   if (!token) {
//     respond(res, "JWT_MISSING", "Refresh token is required");
//     return null;
//   }

//   try {
//     const payload = jwt.verify(token, config.JWT_REFRESH_SECRET) as JwtPayload;
//     return payload;
//   } catch (err: any) {
//     if (err && err.name === "TokenExpiredError") {
//       respond(res, "JWT_EXPIRED", "Refresh token expired, please login again");
//       return null;
//     }

//     respond(res, "JWT_INVALID", "Invalid refresh token");
//     return null;
//   }
// };

// export const requireAuth = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const auth = req.headers["authorization"] || req.headers["Authorization"];
//   const token =
//     typeof auth === "string" && auth.startsWith("Bearer ")
//       ? auth.split(" ")[1]
//       : undefined;

//   const payload = verifyAccessTokenOrRespond(token, res);
//   if (!payload) return; // response already sent

//   // attach to request for downstream handlers (cast or extend types in your app)
//   (req as any).user = payload;
//   return next();
// };
