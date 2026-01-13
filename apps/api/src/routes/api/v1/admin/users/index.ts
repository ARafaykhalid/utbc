import { Router } from "express";
import { validate } from "@api/middlewares";
import {
  VBlockUsers,
  VGetUsers,
  VUnblockUsers,
} from "@shared/validations/admin/users";
import { BlockUsers, GetUsers, unBlockUsers } from "@api/controllers/admin/users";

const AdminManagedUserRoute: Router = Router();

AdminManagedUserRoute.get("/", validate({ query: VGetUsers }), GetUsers);
AdminManagedUserRoute.post(
  "/block",
  validate({ body: VBlockUsers }),
  BlockUsers
);
AdminManagedUserRoute.post(
  "/unblock",
  validate({ body: VUnblockUsers }),
  unBlockUsers
);

export default AdminManagedUserRoute;
