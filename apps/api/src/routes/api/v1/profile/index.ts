import { Router } from "express";
import { validate } from "@/middlewares";
import { VUpdateProfile } from "@shared/validations/profile";
import { UpdateProfile } from "@/controllers/profile";

const ProfileRoute: Router = Router();

ProfileRoute.get("/");
ProfileRoute.patch("/", validate({ body: VUpdateProfile }), UpdateProfile);

export default ProfileRoute;
