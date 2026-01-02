import { Request, Response } from "express";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { UserModel } from "@/models";

export const GetProfile = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;

  try {
    const user = await UserModel.findById(userId).select("-password -sessions");
    if (!user) {
      return respond(res, "NOT_FOUND", "User not found", {
        errors: {
          message: "No user found with the provided ID",
        },
      });
    }

    return respond(res, "SUCCESS", "User profile fetched successfully", {
      data: {
        user,
      },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to change password", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
