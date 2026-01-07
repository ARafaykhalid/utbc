import { Router } from "express";
import {
  GetNavSummary,
  GetProfile,
  MyReviews,
  UpdateProfile,
} from "@/controllers/user";
import { validate } from "@/middlewares";
import { VUpdateProfile } from "@shared/validations";
import UserSettingsRoute from "./settings";
import UserWishListRoute from "./wishlist";
import UserCartRoute from "./cart";
import UserOrdersRoute from "./order";

const UserRoute: Router = Router();

UserRoute.get("/nav-summary", GetNavSummary);
UserRoute.get("/my-reviews", MyReviews);

UserRoute.get("/profile", GetProfile);
UserRoute.patch("/profile", validate({ body: VUpdateProfile }), UpdateProfile);

UserRoute.use("/my-orders", UserOrdersRoute);
UserRoute.use("/settings", UserSettingsRoute);
UserRoute.use("/wishlist", UserWishListRoute);
UserRoute.use("/cart", UserCartRoute);

export default UserRoute;
