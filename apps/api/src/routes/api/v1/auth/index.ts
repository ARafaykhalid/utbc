import { Router } from "express";
import {
  ForgotPassword,
  LoginUser,
  LogoutUser,
  RenewAccessToken,
  ResetPassword,
  UserRegistration,
} from "@api/controllers/auth";
import { validate } from "@api/middlewares";

import {
  VForgotPassword,
  VResetPassword,
  VUserLogin,
  VUserRegistration,
} from "@shared/validations/auth";

const AuthRoute: Router = Router();

AuthRoute.post(
  "/register",
  validate({ body: VUserRegistration }),
  UserRegistration
);

AuthRoute.post("/login", validate({ body: VUserLogin }), LoginUser);
AuthRoute.post("/renew-token", RenewAccessToken);

AuthRoute.post("/logout", LogoutUser);

AuthRoute.post(
  "/forgot-password",
  validate({ body: VForgotPassword }),
  ForgotPassword
);
AuthRoute.post(
  "/reset-password",
  validate({ body: VResetPassword }),
  ResetPassword
);

export default AuthRoute;
