import { Request, Response } from "express";
import { MediaModel } from "@/models";
import { respond } from "@/utils";
import { TAuthData } from "@shared/types";
import { TUpdateMediaBody, TUpdateMediaParams } from "@shared/validations";

export const UpdateMedia = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;
  const { alt, tags } = req.body as TUpdateMediaBody;
  const { mediaId } = req.params as TUpdateMediaParams;

  try {
    const media = await MediaModel.findOne({
      _id: mediaId,
      uploadedBy: userId,
    });

    if (!media) {
      return respond(res, "NOT_FOUND", "Media not found");
    }

    if (alt !== undefined) media.alt = alt;
    if (tags !== undefined) media.tags = tags;

    await media.save();

    return respond(res, "SUCCESS", "Media updated successfully", {
      data: { media },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to update media", {
      errors: { message: (error as Error).message },
    });
  }
};
