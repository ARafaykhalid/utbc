import { Request, Response, Router } from "express";
import { RequireAuth } from "@/middlewares/requiresAuth.middleware";
import AdminRouter from "./admin/admin.route";
import AuthRouter from "./auth/auth.route";

const Routerv1: Router = Router();

Routerv1.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Api is Live!",
    status: "200 ok",
    version: "1",
    timeStamp: new Date().toISOString(),
  });
});

Routerv1.use("/auth", AuthRouter);

Routerv1.use("/admin", RequireAuth, AdminRouter);

export default Routerv1;
