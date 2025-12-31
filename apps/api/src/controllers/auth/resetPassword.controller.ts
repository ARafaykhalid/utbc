import { Request, Response } from "express";
import User from "@/models/user.model";
import { respond } from "@/utils/respond.util";
import argon2 from "argon2";

export const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return respond(res, "NOT_FOUND", "User not found", {
        errors: {
          message: "No user found with the provided email",
        },
      });
    }

    // verify email ownership before allowing password reset

    
    const hashedNewPassword = await argon2.hash(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    return respond(res, "SUCCESS", "Password changed successfully");

  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to reset password", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
