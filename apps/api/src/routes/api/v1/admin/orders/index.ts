import { Router } from "express";
import {
  CancelOrder,
  ChangeOrdersStatus,
  GetOrders,
} from "@/controllers/admin/orders";
import { GetRefundedOrders } from "@/controllers/admin/orders/refunds";
import { validate } from "@/middlewares";
import { VChangeOrdersStatus, VGetOrders } from "@shared/validations";
import {
  VCancelMyOrderBody,
  VCancelMyOrderParams,
} from "@shared/validations/orders";

const AdminOrdersRoute: Router = Router();

AdminOrdersRoute.get("/", validate({ query: VGetOrders }), GetOrders);

AdminOrdersRoute.get("/refunds", GetRefundedOrders);
AdminOrdersRoute.post(
  "/change-status",
  validate({ body: VChangeOrdersStatus }),
  ChangeOrdersStatus
);

AdminOrdersRoute.delete(
  "/cancel",
  validate({ body: VCancelMyOrderBody, params: VCancelMyOrderParams }),
  CancelOrder
);

export default AdminOrdersRoute;
