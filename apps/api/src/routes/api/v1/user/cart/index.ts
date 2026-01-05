import { Router } from "express";
import { validate } from "@/middlewares";
import {
  VAddToCart,
  VRemoveFromCart,
  VUpdateCartItem,
} from "@shared/validations";
import { AddToCart, RemoveCartItem, UpdateCartItem } from "@/controllers/cart";

const UserCartRoute: Router = Router();

UserCartRoute.post("/", validate({ body: VAddToCart }), AddToCart);

UserCartRoute.patch("/", validate({ body: VUpdateCartItem }), UpdateCartItem);

UserCartRoute.delete("/", validate({ body: VRemoveFromCart }), RemoveCartItem);

export default UserCartRoute;
