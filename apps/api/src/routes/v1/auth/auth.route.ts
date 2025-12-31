import { validate } from "@/middlewares/validate.middleware";
import { Router } from "express";
import { CreateUser } from "@/controllers/auth/userRegistration.controller";
import { LoginUser } from "@/controllers/auth/userLogin.controller";
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  UserLoginSchema,
  UserRegistrationSchema,
} from "@shared/validations";
import { RequireAuth } from "@/middlewares/requiresAuth.middleware";
import { LogoutUser } from "@/controllers/auth/logoutUser.controller";
import { RevokeSession } from "@/controllers/auth/revokeSession.controller";
import { RenewAccessToken } from "@/controllers/auth/renewAccessToken.controller";
import { forgotPassword } from "@/controllers/auth/forgotPassword.controller";
import { resetPassword } from "@/controllers/auth/resetPassword.controller";

const AuthRoute: Router = Router();

AuthRoute.post(
  "/register",
  validate({ body: UserRegistrationSchema as any }),
  CreateUser
);

AuthRoute.post(
  "/login",
  validate({ body: UserLoginSchema as any }),
  LoginUser
);

AuthRoute.post("/logout", LogoutUser);

AuthRoute.post("/logout-device/:sessionId", RequireAuth, RevokeSession);

AuthRoute.post("/renew-token", RenewAccessToken);

AuthRoute.post(
  "/forgot-password",
  validate({ body: ForgotPasswordSchema as any }),
  forgotPassword
);

AuthRoute.post(
  "/reset-password",
  validate({ body: ResetPasswordSchema as any }),
  resetPassword
);

export default AuthRoute;
