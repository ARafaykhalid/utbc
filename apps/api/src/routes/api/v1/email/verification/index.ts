import { Router } from "express";
import { validate } from "@api/middlewares";
import {
  VChangeEmailVerification,
  VEmailVerification,
} from "@shared/validations/email/verification";
import {
  ChangeEmailVerification,
  EmailVerification,
} from "@api/controllers/email/verification";

const VerificationRoute: Router = Router();

VerificationRoute.post(
  "/email",
  validate({ body: VEmailVerification }),
  EmailVerification
);

VerificationRoute.post(
  "/change-email",
  validate({ body: VChangeEmailVerification }),
  ChangeEmailVerification
);

export default VerificationRoute;
