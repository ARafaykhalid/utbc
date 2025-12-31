import { Request, Response } from "express";
import User from "@/models/user.model";
import { respond } from "@/utils/respond.util";

export const UpdateProfile = async (req: Request, res: Response) => {
  const {
    name,
    address: { fullName, phone, street, city, state, postalCode, country },
  } = req.body;

  const { userId } = req.user?.userId;

  try {
    const user = await User.findById(userId).select("-password -sessions");
    if (!user) {
      return respond(res, "NOT_FOUND", "User not found", {
        errors: {
          message: "No user found with the provided ID",
        },
      });
    }
    user.name = name || user.name;
    user.address = {
      fullName: fullName || user.address?.fullName || "",
      phone: phone || user.address?.phone || "",
      street: street || user.address?.street || "",
      city: city || user.address?.city || "",
      state: state || user.address?.state || "",
      postalCode: postalCode || user.address?.postalCode || "",
      country: country || user.address?.country || "",
    };
    const updatedUser = await user.save();

    return respond(res, "SUCCESS", "User profile updated successfully", {
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to update profile", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
