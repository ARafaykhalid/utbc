import { Request, Response } from "express";
import { UserModel } from "@api/models";
import { respond } from "@api/utils";
import { TAuthData } from "@shared/types";
import { TUpdateProfile } from "@shared/validations/profile";

export const UpdateProfile = async (req: Request, res: Response) => {
  const { name, address } = req.validated?.body as TUpdateProfile;
  const { userId } = req.user as TAuthData;

  try {
    const user = await UserModel.findById(userId).select("-password -sessions");
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
