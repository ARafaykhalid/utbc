import { Request, Response } from "express";
import User from "@/models/user.model";
import { respond } from "@/utils/respond.util";

export const FetchUsers = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const filter: Record<string, any> = {};

    const role = req.query.role as string | undefined;
    const search = req.query.q as string | undefined;
    const blocked = req.query.blocked as string | undefined;

    if (role) filter.role = role;

    if (blocked === "true") filter.isBlocked = true;
    if (blocked === "false") filter.isBlocked = false;

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
        filters: {
          role: role ?? "all",
          blocked: blocked ?? "all",
        },
      },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch users", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
