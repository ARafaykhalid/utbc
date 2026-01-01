import { validate } from "@/middlewares/validate.middleware";
import { Router } from "express";
import { GetNavSummary } from "@/controllers/user/getNavSummary.controller";
import { GetProfile } from "@/controllers/user/getProfile.controller";
import { ListSessions } from "@/controllers/user/listSessions.controller";
import { RevokeAllSessions } from "@/controllers/auth/revokeAllSessions.controller";
import { SendEmailVerification } from "@/controllers/user/sendEmailVerification.controller";
import { SendChangeEmailVerification } from "@/controllers/user/sendChangeEmailVerification.controller";
import { UpdateProfile } from "@/controllers/user/updateProfile.controller";
import { UpdateProfileSchema } from "@shared/validations/updateProfile.schema";
import UserSettingsRoute from "./settings/settings.route";

const UserRoute: Router = Router();

UserRoute.get("/profile", GetProfile);
UserRoute.get("/nav-summary", GetNavSummary);
UserRoute.get("/list-sessions", ListSessions);

UserRoute.patch(
  "/profile",
  validate({ body: UpdateProfileSchema }),
  UpdateProfile
);

UserRoute.use("/settings", UserSettingsRoute);

export default UserRoute;
