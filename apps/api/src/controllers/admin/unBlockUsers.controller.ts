import { Request, Response } from "express";
import { respond } from "@/utils/respond.util";
import userModel from "@/models/user.model";
import { TBlockUsers } from "@shared/validations";

export const unBlockUsers = async (req: Request, res: Response) => {
  const { userIds } = req.body as TBlockUsers;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return respond(res, "BAD_REQUEST", "userIds array is required");
  }

  try {
    const result = await userModel.updateMany(
      { _id: { $in: userIds } },
      { $set: { isBlocked: false } }
    );

    return respond(res, "SUCCESS", "Users unblocked successfully", {
      data: {
        requested: userIds.length,
        modified: result.modifiedCount,
      },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to unblock users", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
