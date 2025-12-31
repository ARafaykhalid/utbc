import { Request, Response, Router } from "express";
import { RequireAuth } from "@/middlewares/requiresAuth.middleware";
import AdminRoute from "./admin/admin.route";
import AuthRoute from "./auth/auth.route";
import VerificationRoute from "./verification/verification.route";

const Routerv1: Router = Router();

Routerv1.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Api is Live!",
    status: "200 ok",
    version: "1",
    timeStamp: new Date().toISOString(),
  });
});

Routerv1.use("/auth", AuthRoute);

Routerv1.use("/admin", RequireAuth, AdminRoute);

Routerv1.use("/verification", VerificationRoute);

export default Routerv1;
