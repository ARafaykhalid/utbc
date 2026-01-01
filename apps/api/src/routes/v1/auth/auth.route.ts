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
import { LogoutUser } from "@/controllers/auth/logoutUser.controller";
import { RenewAccessToken } from "@/controllers/auth/renewAccessToken.controller";
import { forgotPassword } from "@/controllers/auth/forgotPassword.controller";
import { resetPassword } from "@/controllers/auth/resetPassword.controller";

const AuthRoute: Router = Router();

AuthRoute.post(
  "/register",
  validate({ body: UserRegistrationSchema }),
  CreateUser
);
AuthRoute.post("/login", validate({ body: UserLoginSchema }), LoginUser);
AuthRoute.post("/renew-token", RenewAccessToken);

AuthRoute.post("/logout", LogoutUser);

AuthRoute.post(
  "/forgot-password",
  validate({ body: ForgotPasswordSchema }),
  forgotPassword
);
AuthRoute.post(
  "/reset-password",
  validate({ body: ResetPasswordSchema }),
  resetPassword
);

export default AuthRoute;
