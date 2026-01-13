import { Router } from "express";
import { validate } from "@api/middlewares";
import {
  AddToWishlist,
  MyWishlist,
  RemoveFromWishlist,
} from "@api/controllers/wishlist";
import {
  VAddToWishlist,
  VRemoveFromWishlist,
} from "@shared/validations/wishlist";

const UserWishListRoute: Router = Router();

UserWishListRoute.get("/", MyWishlist);

UserWishListRoute.post("/", validate({ body: VAddToWishlist }), AddToWishlist);

UserWishListRoute.delete(
  "/:productId",
  validate({ params: VRemoveFromWishlist }),
  RemoveFromWishlist
);

export default UserWishListRoute;
