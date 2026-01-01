import { validate } from "@/middlewares/validate.middleware";
import { Router } from "express";
import { EmailVerification } from "@/controllers/verification/emailVerification.controller";
import { EmailVerificationSchema } from "@shared/validations/emailVerification.schema";
import { ChangeEmailVerification } from "@/controllers/verification/changeEmailVerification.controller";

const VerificationRoute: Router = Router();

VerificationRoute.post(
  "/email",
  validate({ body: EmailVerificationSchema }),
  EmailVerification
);

VerificationRoute.post("/change-email", ChangeEmailVerification);

export default VerificationRoute;
