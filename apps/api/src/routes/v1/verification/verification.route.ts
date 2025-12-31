import { validate } from "@/middlewares/validate.middleware";
import { Router } from "express";
import { EmailVerification } from "@/controllers/verification/emailVerification.controller";
import { EmailVerificationSchema } from "@shared/validations/emailVerification.schema";
import { SendEmailVerification } from "@/controllers/user/sendEmailVerification.controller";
import { RequireAuth } from "@/middlewares/requiresAuth.middleware";

const VerificationRoute: Router = Router();

VerificationRoute.post(
  "/verify-email",
  validate({ body: EmailVerificationSchema as any }),
  EmailVerification
);

VerificationRoute.post(
  "/send-verification-email",
  RequireAuth,
  SendEmailVerification
);

export default VerificationRoute;
