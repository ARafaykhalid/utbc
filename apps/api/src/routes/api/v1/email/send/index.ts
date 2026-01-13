import { Router } from "express";
import {
  SendChangeEmailVerification,
  SendEmailVerification,
} from "@api/controllers/email/send";
import { validate } from "@api/middlewares";
import { VSendChangeEmailVerification } from "@shared/validations/email/send";

const SendEmailRoute: Router = Router();

SendEmailRoute.post("/email-verification", SendEmailVerification);
SendEmailRoute.post(
  "/change-email-verification",
  validate({ body: VSendChangeEmailVerification }),
  SendChangeEmailVerification
);

export default SendEmailRoute;
