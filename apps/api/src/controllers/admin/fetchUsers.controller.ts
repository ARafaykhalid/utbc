import { Request, Response } from "express";
import { UserModel } from "@/models";
import { respond } from "@/utils";
import { TFetchUsers } from "@shared/validations";

export const FetchUsers = async (req: Request, res: Response) => {
  try {
    const { page, limit, sortBy, order, role, blocked, search } = req?.validated
      ?.query as TFetchUsers;

    const skip = (page - 1) * limit;
    const filter: Record<string, any> = {};

    if (role) filter.role = role;
    if (blocked !== undefined) filter.isBlocked = blocked;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .select("-password -sessions")
        .sort({ [sortBy as string]: order } as Record<string, 1 | -1>)
        .skip(skip)
        .limit(limit)
        .lean(),

      UserModel.countDocuments(filter),
    ]);

    return respond(res, "SUCCESS", "Users fetched successfully", {
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
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
