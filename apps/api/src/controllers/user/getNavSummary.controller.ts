import { Request, Response } from "express";
import User from "@/models/user.model";
import { respond } from "@/utils/respond.util";
import { TAuthData } from "@/types/userId";

export const GetNavSummary = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;

  try {
    const user = await User.findById(userId).select(
      "email name isEmailVerified"
    );
    if (!user) {
      return respond(res, "NOT_FOUND", "User not found", {
        errors: {
          message: "No user found with the provided ID",
        },
      });
    }

    return respond(res, "SUCCESS", "User navigation summary fetched successfully", {
      data: {
        user,
      },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch user navigation summary", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
