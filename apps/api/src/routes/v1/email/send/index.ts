import {
  SendChangeEmailVerification,
  SendEmailVerification,
} from "@/controllers/user";
import { Router } from "express";

const SendEmailRoute: Router = Router();

SendEmailRoute.post("/email-verification", SendEmailVerification);
SendEmailRoute.post("/change-email-verification", SendChangeEmailVerification);

export default SendEmailRoute;
