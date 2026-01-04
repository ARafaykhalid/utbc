import { Request, Response, Router } from "express";
import { requireAuth } from "@/middlewares";
import AdminRoute from "./admin";
import AuthRoute from "./auth";
import UserRoute from "./user";
import EmailRoute from "./email";
import ProductRoute from "./product";
import CategoryRoute from "./category";
import ReviewRoute from "./review";

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

RootRouter.use("/admin", requireAuth, AdminRoute);

RootRouter.use("/user", requireAuth, UserRoute);

RootRouter.use("/products", requireAuth, ProductRoute);

RootRouter.use("/reviews", requireAuth, ReviewRoute);

RootRouter.use("/categories", requireAuth, CategoryRoute);

RootRouter.use("/email", EmailRoute);

export default RootRouter;
