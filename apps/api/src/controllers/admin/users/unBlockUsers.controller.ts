import { Request, Response } from "express";
import { respond } from "@api/utils";
import { UserModel } from "@api/models";
import { TBlockUsers } from "@shared/validations/admin/users";
import { TAuthData } from "@shared/types";

export const unBlockUsers = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const { userIds } = req.validated?.body as TBlockUsers;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return respond(res, "BAD_REQUEST", "userIds array is required");
  }

  try {
    const result = await UserModel.updateMany(
      { _id: { $in: userIds } },
      { $set: { isBlocked: false, updatedBy: userId } }
    );

    return respond(res, "SUCCESS", "Users unblocked successfully");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to unblock users", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
