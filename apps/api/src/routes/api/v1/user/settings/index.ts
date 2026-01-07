import { Router } from "express";
import { validate } from "@/middlewares";
import { VChangePassword, VRevokeSession } from "@shared/validations";
import {
  ChangePassword,
  ListSessions,
  RevokeAllSessions,
  RevokeSession,
} from "@/controllers/user/settings";

const UserSettingsRoute: Router = Router();

UserSettingsRoute.post(
  "/revoke-session/:sessionId",
  validate({ params: VRevokeSession }),
  RevokeSession
);

UserSettingsRoute.get("/list-sessions", ListSessions);
UserSettingsRoute.post("/revoke-all-sessions", RevokeAllSessions);
UserSettingsRoute.post(
  "/change-password",
  validate({ body: VChangePassword }),
  ChangePassword
);

export default UserSettingsRoute;
