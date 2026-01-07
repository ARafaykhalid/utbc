import { Router } from "express";
import { validate } from "@/middlewares";
import {
  VAddToCart,
  VCheckout,
  VRemoveFromCart,
  VUpdateCartItem,
} from "@shared/validations";
import {
  AddToCart,
  GetCart,
  RemoveCartItem,
  UpdateCartItem,
} from "@/controllers/cart";
import { Checkout } from "@/controllers/cart/";

const UserCartRoute: Router = Router();

UserCartRoute.get("/", GetCart);

UserCartRoute.post("/", validate({ body: VAddToCart }), AddToCart);

UserCartRoute.patch("/", validate({ body: VUpdateCartItem }), UpdateCartItem);

UserCartRoute.delete("/", validate({ body: VRemoveFromCart }), RemoveCartItem);

UserCartRoute.post("/checkout", validate({ body: VCheckout }), Checkout);

export default UserCartRoute;
