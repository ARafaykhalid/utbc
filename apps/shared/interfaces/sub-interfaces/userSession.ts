export interface UserSession {
  token: string;
  ip?: string;
  userAgent?: {
    browser?: string;
    os?: string;
    device?: string;
  };
  createdAt: Date;
  expiresAt?: Date;
}
