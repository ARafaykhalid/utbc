import { Router } from "express";
import VerificationRoute from "./verification/verification.route";
import SendEmailRoute from "./send/send.route";
import { RequireAuth } from "@/middlewares/requiresAuth.middleware";

const EmailRoute: Router = Router();


EmailRoute.use("/verify", VerificationRoute);
EmailRoute.use("/send", RequireAuth, SendEmailRoute);

export default EmailRoute;
