import { Request, Response } from "express";
import { respond } from "@api/utils";
import { UserModel } from "@api/models";
import { TBlockUsers } from "@shared/validations/admin/users";

export const BlockUsers = async (req: Request, res: Response) => {
  const { userIds } = req.validated?.body as TBlockUsers;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return respond(res, "BAD_REQUEST", "userIds array is required");
  }

  try {
    const result = await UserModel.updateMany(
      { _id: { $in: userIds } },
      { $set: { isBlocked: true } }
    );

    return respond(res, "SUCCESS", "Users blocked successfully", {
      data: {
        requested: userIds.length,
        modified: result.modifiedCount,
      },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to block users", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
