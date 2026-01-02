import { Router } from "express";
import { VBlockUsers, VFetchUsers } from "@shared/validations";
import { validate } from "@/middlewares";
import { BlockUsers, GetUsers, unBlockUsers } from "@/controllers/admin";
import ProductRoute from "./product";

const AdminRoute: Router = Router();

AdminRoute.patch("/block-users", validate({ body: VBlockUsers }), BlockUsers);

AdminRoute.patch(
  "/unblock-users",
  validate({ body: VBlockUsers }),
  unBlockUsers
);

AdminRoute.get("/fetch-users", validate({ query: VFetchUsers }), GetUsers);
AdminRoute.use(ProductRoute);

export default AdminRoute;
