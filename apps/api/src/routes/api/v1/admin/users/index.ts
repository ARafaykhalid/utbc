import { Router } from "express";
import { validate } from "@/middlewares";
import { VBlockUsers, VGetUsers, VUnblockUsers } from "@shared/validations";
import { BlockUsers, GetUsers, unBlockUsers } from "@/controllers/admin/users";

const AdminManagedUserRoute: Router = Router();

AdminManagedUserRoute.get("/", validate({ query: VGetUsers }), GetUsers);
AdminManagedUserRoute.post("/block", validate({ body: VBlockUsers }), BlockUsers);
AdminManagedUserRoute.post(
  "/unblock",
  validate({ body: VUnblockUsers }),
  unBlockUsers
);

export default AdminManagedUserRoute;
