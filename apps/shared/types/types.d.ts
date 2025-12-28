declare namespace Express {
  interface Request {
    useragent?: {
      browser?: string;
      os?: string;
      platform?: string;
    };
    clientIp?: string;
  }
}
