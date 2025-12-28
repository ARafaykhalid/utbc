import { validate } from "@/middlewares/validate";
import { Request, Response, Router } from "express";
import { userLoginSchema, userRegistrationSchema } from "@shared/validations";
import { CreateUser } from "@/controllers/auth/userRegistration.controller";
import { LoginUser } from "@/controllers/auth/userLogin.controller";

const RouterUser: Router = Router();

RouterUser.post(
  "/register",
  validate({ body: userRegistrationSchema as any }),
  CreateUser
);

RouterUser.post(
  "/login",
  validate({ body: userLoginSchema as any }),
  LoginUser
);

export default RouterUser;
