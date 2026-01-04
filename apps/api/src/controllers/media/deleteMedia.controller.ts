import { Request, Response } from "express";
import { MediaModel } from "@/models";
import { TAuthData } from "@shared/types";
import { respond } from "@/utils";
import { cloudinaryV2 } from "@/lib";
import { TDeleteMediaParams } from "@shared/validations";

export const DeleteMedia = async (req: Request, res: Response) => {
  const { mediaId } = req.validated?.params as TDeleteMediaParams;
  const { userId } = req.user as TAuthData;

  try {
    const media = await MediaModel.findOne({
      _id: mediaId,
      uploadedBy: userId,
    });

    if (!media) {
      return respond(res, "NOT_FOUND", "Media not found");
    }

    await cloudinaryV2.uploader.destroy(media.publicId, {
      resource_type: media.type,
    });

    await media.deleteOne();

    return respond(res, "SUCCESS", "Media deleted successfully");
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to delete media", {
      errors: { message: (error as Error).message },
    });
  }
};
