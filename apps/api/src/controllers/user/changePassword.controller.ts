import { Request, Response } from "express";
import argon2 from "argon2";
import { respond } from "@/utils";
import { TChangePassword } from "@shared/validations";
import { TAuthData } from "@shared/types";
import { UserModel } from "@/models";

export const ChangePassword = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const { oldPassword, newPassword } = req.validated?.body as TChangePassword;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return respond(res, "NOT_FOUND", "User not found", {
        errors: {
          message: "No user found with the provided ID",
        },
      });
    }

    const isOldPasswordValid = await argon2.verify(user.password, oldPassword);
    if (!isOldPasswordValid) {
      return respond(res, "UNAUTHORIZED", "Old password is incorrect", {
        errors: {
          message: "The old password provided is incorrect",
        },
      });
    }

    const hashedNewPassword = await argon2.hash(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    return respond(res, "SUCCESS", "Password changed successfully");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to change password", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
