import { Router } from "express";
import {
  ForgotPassword,
  LoginUser,
  LogoutUser,
  RenewAccessToken,
  ResetPassword,
  UserRegistration,
} from "@/controllers/auth";
import { validate } from "@/middlewares";
import {
  VForgotPassword,
  VResetPassword,
  VUserLogin,
  VUserRegistration,
} from "@shared/validations";

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
