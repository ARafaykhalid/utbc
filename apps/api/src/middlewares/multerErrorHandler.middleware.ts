import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { respond } from "@/utils";

export const multerErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return respond(res, "BAD_REQUEST", "Too many files uploaded", {
        errors: [
          {
            path: "images",
            message: "Maximum 5 images allowed",
          },
        ],
      });
    }

    if (err.code === "LIMIT_FILE_SIZE") {
      return respond(res, "BAD_REQUEST", "File too large", {
        errors: [
          {
            path: "images",
            message: "Each image must be under 5MB",
          },
        ],
      });
    }
  }

  next(err);
};
