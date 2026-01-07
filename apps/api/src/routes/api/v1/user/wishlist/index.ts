import { Router } from "express";
import { validate } from "@/middlewares";
import { VAddToWishlist, VRemoveFromWishlist } from "@shared/validations";
import {
  AddToWishlist,
  GetWishlist,
  RemoveFromWishlist,
} from "@/controllers/wishlist";

const UserWishListRoute: Router = Router();

UserWishListRoute.get("/", GetWishlist);
UserWishListRoute.post("/", validate({ body: VAddToWishlist }), AddToWishlist);

UserWishListRoute.delete(
  "/:productId",
  validate({ params: VRemoveFromWishlist }),
  RemoveFromWishlist
);

export default UserWishListRoute;
