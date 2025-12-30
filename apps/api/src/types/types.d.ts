declare namespace Express {
  interface Request {
    useragent?: {
      browser?: string;
      os?: string;
      platform?: string;
    };
    clientIp?: string;
    user?: {
      userId: ObjectId;
      sessionId: ObjectId;
      role?: string;
    };
  }
}
