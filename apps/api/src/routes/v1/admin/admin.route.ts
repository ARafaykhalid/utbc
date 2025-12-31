import { BlockUsers } from "@/controllers/admin/blockUsers.controller";
import { FetchUsers } from "@/controllers/admin/FetchUsers.controller";
import { RequireAuth } from "@/middlewares/requiresAuth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { BlockUsersSchema, FetchUsersQuerySchema } from "@shared/validations";
import { Router } from "express";

const AdminRouter: Router = Router();

AdminRouter.patch(
  "/block-users",
  validate({ body: BlockUsersSchema as any }),
  RequireAuth,
  BlockUsers
);

AdminRouter.get(
  "/fetch-users",
  validate({ query: FetchUsersQuerySchema as any }),
  RequireAuth,
  FetchUsers
);

export default AdminRouter;
