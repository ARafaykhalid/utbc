import { Request, Response } from "express";
import User from "@/models/user.model";
import { respond } from "@/utils/respond.util";
import { TAuthData } from "@/types/userId";
import { TUpdateProfile } from "@shared/validations/updateProfile.schema";

export const UpdateProfile = async (req: Request, res: Response) => {
  const { name, address } = req.body as TUpdateProfile;
  const { userId } = req.user as TAuthData;

  try {
    const user = await User.findById(userId).select("-password -sessions");
    if (!user) {
      return respond(res, "NOT_FOUND", "User not found");
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (address) {
      user.address = {
        ...user.address,
        ...address,
      };
    }

    await user.save();
    return respond(res, "SUCCESS", "User profile updated successfully");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to update profile", {
      errors: { message: (error as Error).message },
    });
  }
};
