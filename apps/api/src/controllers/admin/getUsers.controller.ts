import { Request, Response } from "express";
import User from "@/models/user.model";
import { respond } from "@/utils/respond.util";
import { FetchUsersSchema } from "@shared/validations/fetchUsers.schema";

export const GetUsers = async (req: Request, res: Response) => {
  try {
    const parsed = FetchUsersSchema.parse(req.query);

    const { page, limit, sortBy, order, role, blocked, search } = parsed;

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
      User.find(filter)
        .select("-password -sessions")
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)
        .lean(),

      User.countDocuments(filter),
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
    return respond(res, "BAD_REQUEST", "Invalid query parameters", {
      errors: {
        message: (error as Error).message,
      },
    });
  }
};
