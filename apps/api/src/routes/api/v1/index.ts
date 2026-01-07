import { Request, Response, Router } from "express";
import { requireAuth } from "@/middlewares";
import AdminRoute from "./admin";
import AuthRoute from "./auth";
import UserRoute from "./user";
import EmailRoute from "./email";
import ProductRoute from "./product";
import CategoryRoute from "./category";
import ReviewRoute from "./product/review";

const V1RootRouter: Router = Router();

V1RootRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Api is Live!",
    status: "200 ok",
    version: "1",
    timeStamp: new Date().toISOString(),
  });
});

V1RootRouter.use("/auth", AuthRoute);

V1RootRouter.use("/admin", requireAuth, AdminRoute);

V1RootRouter.use("/user", requireAuth, UserRoute);

V1RootRouter.use("/products", requireAuth, ProductRoute);

V1RootRouter.use("/reviews", requireAuth, ReviewRoute);

V1RootRouter.use("/categories", requireAuth, CategoryRoute);

V1RootRouter.use("/email", EmailRoute);

export default V1RootRouter;
