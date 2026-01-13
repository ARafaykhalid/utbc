import { Router } from "express";
import { validate } from "@api/middlewares";
import {
  VAddToCart,
  VCheckout,
  VRemoveFromCart,
  VUpdateCartItem,
} from "@shared/validations/cart";
import {
  AddToCart,
  MyCart,
  RemoveCartItem,
  UpdateCartItem,
} from "@api/controllers/cart";
import { Checkout } from "@api/controllers/cart/";

const CartRoute: Router = Router();

CartRoute.get("/", MyCart);

CartRoute.post("/", validate({ body: VAddToCart }), AddToCart);

CartRoute.patch("/", validate({ body: VUpdateCartItem }), UpdateCartItem);

CartRoute.delete("/", validate({ body: VRemoveFromCart }), RemoveCartItem);

CartRoute.post("/checkout", validate({ body: VCheckout }), Checkout);

export default CartRoute;
