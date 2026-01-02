import { Router } from "express";
import { validate } from "@/middlewares";
import { VRevokeSession } from "@shared/validations";
import { RevokeAllSessions, RevokeSession } from "@/controllers/auth";

const UserSettingsRoute: Router = Router();

UserSettingsRoute.post(
  "/revoke-session/:sessionId",
  validate({ params: VRevokeSession }),
  RevokeSession
);
UserSettingsRoute.post("/revoke-all-sessions", RevokeAllSessions);

export default UserSettingsRoute;
