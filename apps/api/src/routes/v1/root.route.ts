import { Request, Response, Router } from "express";
import { RequireAuth } from "@/middlewares/requiresAuth.middleware";
import AdminRoute from "./admin/admin.route";
import AuthRoute from "./auth/auth.route";
import UserRoute from "./user/user.route";
import EmailRoute from "./email/email.route";

const RootRouter: Router = Router();

RootRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Api is Live!",
    status: "200 ok",
    version: "1",
    timeStamp: new Date().toISOString(),
  });
});

RootRouter.use("/auth", AuthRoute);

RootRouter.use("/admin", RequireAuth, AdminRoute);

RootRouter.use("/user", RequireAuth, UserRoute);

RootRouter.use("/email", EmailRoute);

export default RootRouter;
