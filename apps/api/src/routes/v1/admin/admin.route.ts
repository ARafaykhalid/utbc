import { BlockUsers } from "@/controllers/admin/blockUsers.controller";
import { GetUsers } from "@/controllers/admin/getUsers.controller";
import { unBlockUsers } from "@/controllers/admin/unBlockUsers.controller";
import { RequireAuth } from "@/middlewares/requiresAuth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { BlockUsersSchema, FetchUsersSchema } from "@shared/validations";
import { Router } from "express";

const AdminRoute: Router = Router();

AdminRoute.patch(
  "/block-users",
  validate({ body: BlockUsersSchema }),
  BlockUsers
);

AdminRoute.patch(
  "/unblock-users",
  validate({ body: BlockUsersSchema }),
  unBlockUsers
);

AdminRoute.get("/fetch-users", validate({ query: FetchUsersSchema }), GetUsers);

export default AdminRoute;
