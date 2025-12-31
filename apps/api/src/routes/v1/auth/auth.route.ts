import { validate } from "@/middlewares/validate.middleware";
import { Router } from "express";
import { CreateUser } from "@/controllers/auth/userRegistration.controller";
import { LoginUser } from "@/controllers/auth/userLogin.controller";
import { UserLoginSchema, UserRegistrationSchema } from "@shared/validations";
import { RequireAuth } from "@/middlewares/requiresAuth.middleware";
import { LogoutUser } from "@/controllers/auth/logoutUser.controller";
import { LogoutSession } from "@/controllers/auth/logoutSession.controller";
import { RenewAccessToken } from "@/controllers/auth/renewAccessToken.controller";

const AuthRouter: Router = Router();

AuthRouter.post(
  "/register",
  validate({ body: UserRegistrationSchema as any }),
  CreateUser
);

AuthRouter.post(
  "/login",
  validate({ body: UserLoginSchema as any }),
  LoginUser
);

AuthRouter.post("/logout", LogoutUser);

AuthRouter.post("/logout-device/:sessionId", RequireAuth, LogoutSession);

AuthRouter.post("/renew-token", RenewAccessToken);

export default AuthRouter;
