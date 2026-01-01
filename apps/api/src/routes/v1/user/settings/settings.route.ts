import { validate } from "@/middlewares/validate.middleware";
import { Router } from "express";
import { RevokeSessionSchema } from "@shared/validations";
import { RequireAuth } from "@/middlewares/requiresAuth.middleware";
import { RevokeAllSessions } from "@/controllers/auth/revokeAllSessions.controller";
import { RevokeSession } from "@/controllers/auth/revokeSession.controller";

const UserSettingsRoute: Router = Router();

UserSettingsRoute.post(
  "/revoke-session/:sessionId",
  validate({ params: RevokeSessionSchema }),
  RevokeSession
);
UserSettingsRoute.post(
  "/revoke-all-sessions",
  validate({ body: RevokeSessionSchema }),
  RevokeAllSessions
);

export default UserSettingsRoute;
