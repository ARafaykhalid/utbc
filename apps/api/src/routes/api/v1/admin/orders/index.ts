import { Router } from "express";
import {
  CancelOrder,
  ChangeOrdersStatus,
  GetOrders,
} from "@/controllers/admin/orders";
import { validate } from "@/middlewares";
import {
  VChangeOrdersStatus,
  VGetOrders,
  VCancelOrderBody,
  VCancelOrderParams,
} from "@shared/validations/admin/orders";

const AdminOrdersRoute: Router = Router();

AdminOrdersRoute.get("/", validate({ query: VGetOrders }), GetOrders);

AdminOrdersRoute.post(
  "/change-status",
  validate({ body: VChangeOrdersStatus }),
  ChangeOrdersStatus
);

AdminOrdersRoute.delete(
  "/cancel",
  validate({ body: VCancelOrderBody, params: VCancelOrderParams }),
  CancelOrder
);

export default AdminOrdersRoute;
