import { Request, Response } from "express";
import { MediaModel } from "@api/models";
import { TAuthData } from "@shared/types";
import { respond, uploadToCloudinary } from "@api/utils";
import { TAddMedia } from "@shared/validations/media";

export const AddMedia = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const { userId } = req.user as TAuthData;
  const { tags, alt } = req.body as TAddMedia;

  if (!files || files.length === 0) {
    return respond(res, "BAD_REQUEST", "No files uploaded", {
      errors: { "body.files": "At least one file is required" },
    });
  }

  try {
    const mediaDocs = [];

    for (const file of files) {
      const type = file.mimetype.startsWith("video") ? "video" : "image";

      const upload = await uploadToCloudinary(file.buffer, type);

      mediaDocs.push({
        url: upload.secure_url,
        publicId: upload.public_id,
        type,
        alt,
        tags: tags ? tags : [],
        uploadedBy: userId,
      });
    }

    const savedMedia = await MediaModel.insertMany(mediaDocs);

    return respond(res, "SUCCESS", "Media uploaded successfully", {
      data: { media: savedMedia },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Media upload failed", {
      errors: { message: (error as Error).message },
    });
  }
};
