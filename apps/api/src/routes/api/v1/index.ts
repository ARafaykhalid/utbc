import { Request, Response, Router } from "express";
import { requireAuth } from "@api/middlewares";
import AdminRoute from "./admin";
import AuthRoute from "./auth";
import EmailRoute from "./email";
import ProductsRoute from "./products";
import CategoryRoute from "./category";
import ReviewRoute from "./reviews";
import MediaRoute from "./media";
import CartRoute from "./cart";

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

V1RootRouter.use("/media", requireAuth, MediaRoute);

V1RootRouter.use("/cart", requireAuth, CartRoute);

V1RootRouter.use("/products", ProductsRoute);

V1RootRouter.use("/reviews", requireAuth, ReviewRoute);

V1RootRouter.use("/products", requireAuth, ProductsRoute);

V1RootRouter.use("/settings", requireAuth, CategoryRoute);

V1RootRouter.use("/categories", requireAuth, CategoryRoute);

V1RootRouter.use("/products", requireAuth, ProductsRoute);

V1RootRouter.use("/email", EmailRoute);

export default V1RootRouter;
