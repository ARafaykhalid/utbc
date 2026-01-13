import { Request, Response } from "express";
import { MediaModel } from "@api/models";
import { respond } from "@api/utils";
import { TAuthData } from "@shared/types";
import { TGetMediaQuery } from "@shared/validations/media";

export const GetMedia = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;

  const {
    page = 1,
    limit = 10,
    type,
    tag,
    sortBy = "createdAt",
    order = "desc",
  } = req.validated?.query as TGetMediaQuery;

  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(limit, 50);
  const skip = (safePage - 1) * safeLimit;

  const filter: Record<string, any> = {
    uploadedBy: userId,
  };

  if (type) filter.type = type;
  if (tag) filter.tags = tag;

  // 🔒 sort is fully controlled by Zod enums
  const sort: Record<string, 1 | -1> = {
    [sortBy]: order === "asc" ? 1 : -1,
  };

  try {
    const [media, total] = await Promise.all([
      MediaModel.find(filter).sort(sort).skip(skip).limit(safeLimit).lean(),

      MediaModel.countDocuments(filter),
    ]);

    return respond(res, "SUCCESS", "Media fetched successfully", {
      data: {
        media,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages: Math.ceil(total / safeLimit),
        },
      },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch media", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
