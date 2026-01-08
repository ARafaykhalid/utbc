import { Router } from "express";
import { validate } from "@/middlewares";
import {
  AddToWishlist,
  MyWishlist,
  RemoveFromWishlist,
} from "@/controllers/wishlist";
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
