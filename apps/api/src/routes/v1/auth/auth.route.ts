import { validate } from "@/middlewares/validate.middleware";
import { Router } from "express";
import { CreateUser } from "@/controllers/auth/userRegistration.controller";
import { LoginUser } from "@/controllers/auth/userLogin.controller";
import { UserLoginSchema, UserRegistrationSchema } from "@shared/validations";
import { requireAuth } from "@/middlewares/requiresAuth.middleware";
import { LogoutUser } from "@/controllers/auth/logoutUser.controller";
import { LogoutDevice } from "@/controllers/auth/logoutDevice.controller";
import { RenewAccessToken } from "@/controllers/auth/renewAccessToken.controller";

const RouterAuth: Router = Router();

RouterAuth.post(
  "/register",
  validate({ body: UserRegistrationSchema as any }),
  CreateUser
);

RouterAuth.post(
  "/login",
  validate({ body: UserLoginSchema as any }),
  LoginUser
);

RouterAuth.post("/logout", LogoutUser);

RouterAuth.post("/logout-device/:sessionId", requireAuth, LogoutDevice);

RouterAuth.post("/renew-token", RenewAccessToken);

export default RouterAuth;
