import { Router } from "express";
import { validate } from "@/middlewares";
import { VRemoveFromWishlist } from "@shared/validations";
import { GetWishlist, RemoveFromWishlist } from "@/controllers/wishlist";

const UserWishListRoute: Router = Router();

UserWishListRoute.get("/", GetWishlist);

UserWishListRoute.delete(
  "/:slug",
  validate({ params: VRemoveFromWishlist }),
  RemoveFromWishlist
);

export default UserWishListRoute;
