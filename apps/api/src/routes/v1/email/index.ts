import { Router } from "express";
import VerificationRoute from "./verification";
import SendEmailRoute from "./send";
import { requireAuth } from "@/middlewares";

const EmailRoute: Router = Router();

EmailRoute.use("/verify", VerificationRoute);
EmailRoute.use("/send", requireAuth, SendEmailRoute);

export default EmailRoute;
