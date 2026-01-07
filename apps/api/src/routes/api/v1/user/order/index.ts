import { Router } from "express";
import { validate } from "@/middlewares";
import { CancelMyOrder, GetMyOrders } from "@/controllers/user/orders";
import {
  VCancelMyOrderBody,
  VCancelMyOrderParams,
} from "@shared/validations/orders";

const UserOrdersRoute: Router = Router();

UserOrdersRoute.get("/", GetMyOrders);

UserOrdersRoute.delete(
  "/:orderId",
  validate({ params: VCancelMyOrderParams, body: VCancelMyOrderBody }),
  CancelMyOrder
);

export default UserOrdersRoute;
