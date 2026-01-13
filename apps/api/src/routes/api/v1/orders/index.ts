import { Router } from "express";
import { validate } from "@api/middlewares";
import { CancelMyOrder, GetMyOrders } from "@api/controllers/orders";
import {
  VCancelMyOrderBody,
  VCancelMyOrderParams,
} from "@shared/validations/orders";

const OrdersRoute: Router = Router();

OrdersRoute.get("/", GetMyOrders);

OrdersRoute.delete(
  "/:orderId",
  validate({ params: VCancelMyOrderParams, body: VCancelMyOrderBody }),
  CancelMyOrder
);

export default OrdersRoute;
