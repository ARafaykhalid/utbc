import { BlockUsers } from "@/controllers/user/blockUsers.controller";
import { GetUsers } from "@/controllers/user/getUsers.controller";
import { RequireAuth } from "@/middlewares/requiresAuth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { BlockUsersSchema, GetUsersQuerySchema } from "@shared/validations";
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
  validate({ query: GetUsersQuerySchema as any }),
  RequireAuth,
  GetUsers
);

export default AdminRouter;
