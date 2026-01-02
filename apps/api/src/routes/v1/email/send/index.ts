import {
  SendChangeEmailVerification,
  SendEmailVerification,
} from "@/controllers/user";
import { validate } from "@/middlewares";
import {
  VSendChangeEmailVerification,
  VSendEmailVerification,
} from "@shared/validations";
import { Router } from "express";

const SendEmailRoute: Router = Router();

SendEmailRoute.post(
  "/email-verification",
  validate({ body: VSendEmailVerification }),
  SendEmailVerification
);
SendEmailRoute.post(
  "/change-email-verification",
  validate({ body: VSendChangeEmailVerification }),
  SendChangeEmailVerification
);

export default SendEmailRoute;
