import { Router } from "express";
import { VBlockUsers, VFetchUsers } from "@shared/validations";
import { validate } from "@/middlewares";
import { BlockUsers, FetchUsers, unBlockUsers } from "@/controllers/admin";
import ProductRoute from "./product";
import MediaRoute from "./media";

const AdminRoute: Router = Router();

AdminRoute.patch("/block-users", validate({ body: VBlockUsers }), BlockUsers);

AdminRoute.patch(
  "/unblock-users",
  validate({ body: VBlockUsers }),
  unBlockUsers
);

AdminRoute.get("/fetch-users", validate({ query: VFetchUsers }), FetchUsers);

AdminRoute.use("/product", ProductRoute);
AdminRoute.use("/media", MediaRoute);

export default AdminRoute;
