import { validate } from "@/middlewares/validate";
import { Request, Response, Router } from "express";
import { userRegistrationSchema } from "@shared/validations";
import { CreateUser } from "@/controllers/auth/userRegistration.controller";

const RouterUser: Router = Router();

RouterUser.post(
  "/register",
  validate({ body: userRegistrationSchema as any }),
  CreateUser
);

export default RouterUser;
