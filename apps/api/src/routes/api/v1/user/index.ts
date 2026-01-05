import { Router } from "express";
import {
  GetNavSummary,
  GetProfile,
  ListSessions,
  MyReviews,
  UpdateProfile,
} from "@/controllers/user";
import { validate } from "@/middlewares";
import { VUpdateProfile } from "@shared/validations";
import UserSettingsRoute from "./settings";
import UserWishListRoute from "./wishlist";

const UserRoute: Router = Router();

UserRoute.get("/profile", GetProfile);
UserRoute.get("/nav-summary", GetNavSummary);
UserRoute.get("/list-sessions", ListSessions);
UserRoute.get("/my-reviews", MyReviews);

UserRoute.patch("/profile", validate({ body: VUpdateProfile }), UpdateProfile);

UserRoute.use("/settings", UserSettingsRoute);
UserRoute.use("/wishlist", UserWishListRoute);

export default UserRoute;
