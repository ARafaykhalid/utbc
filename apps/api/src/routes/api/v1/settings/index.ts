import { Router } from "express";
import { validate } from "@/middlewares";

import {
  RevokeSession,
  RevokeAllSessions,
  ChangePassword,
  GetNavSummary,
  ListSessions,
} from "@/controllers/settings";
import { VRevokeSession, VChangePassword } from "@shared/validations/settings";

const UserSettingsRoute: Router = Router();

UserSettingsRoute.post(
  "/revoke-session/:sessionId",
  validate({ params: VRevokeSession }),
  RevokeSession
);
UserSettingsRoute.post("/revoke-all-sessions", RevokeAllSessions);
UserSettingsRoute.post(
  "/change-password",
  validate({ body: VChangePassword }),
  ChangePassword
);

UserSettingsRoute.post("/nav-summary", GetNavSummary);
UserSettingsRoute.get("/list-sessions", ListSessions);

export default UserSettingsRoute;
