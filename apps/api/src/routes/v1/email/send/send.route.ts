import { SendChangeEmailVerification } from "@/controllers/user/sendChangeEmailVerification.controller";
import { SendEmailVerification } from "@/controllers/user/sendEmailVerification.controller";
import { Router } from "express";

const SendEmailRoute: Router = Router();

SendEmailRoute.post("/email-verification", SendEmailVerification);
SendEmailRoute.post("/change-email-verification", SendChangeEmailVerification);

export default SendEmailRoute;
