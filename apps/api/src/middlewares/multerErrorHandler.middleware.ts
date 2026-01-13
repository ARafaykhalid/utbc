import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { respond } from "@api/utils";

type ErrorCode =
  | "LIMIT_PART_COUNT"
  | "LIMIT_FILE_SIZE"
  | "LIMIT_FILE_COUNT"
  | "LIMIT_FIELD_KEY"
  | "LIMIT_FIELD_VALUE"
  | "LIMIT_FIELD_COUNT"
  | "LIMIT_UNEXPECTED_FILE"
  | "MISSING_FIELD_NAME";

export const multerErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    switch (err.code as ErrorCode) {
      case "LIMIT_UNEXPECTED_FILE":
        return respond(res, "BAD_REQUEST", "File Type Not Allowed", {
          errors: { "body.files": err.message },
        });
      case "LIMIT_FILE_SIZE":
        return respond(res, "BAD_REQUEST", "File size limit exceeded", {
          errors: { "body.files": "Each file must be under 50MB" },
        });
      case "LIMIT_FILE_COUNT":
        return respond(res, "BAD_REQUEST", "File limit exceeded", {
          errors: { "body.files": "Maximum 5 files are allowed" },
        });
      case "MISSING_FIELD_NAME":
        return respond(res, "BAD_REQUEST", "No filses uploaded", {
          errors: { "body.files": err.message },
        });
      case "LIMIT_PART_COUNT":
        return respond(res, "BAD_REQUEST", "File upload error", {
          errors: { "body.files": err.message },
        });
      case "LIMIT_FIELD_COUNT":
        return respond(res, "BAD_REQUEST", "File upload error", {
          errors: { "body.files": err.message },
        });
      case "LIMIT_FIELD_KEY":
        return respond(res, "BAD_REQUEST", "File upload error", {
          errors: { "body.files": err.message },
        });
      case "LIMIT_FIELD_VALUE":
        return respond(res, "BAD_REQUEST", "File upload error", {
          errors: { "body.files": err.message },
        });
      default:
        return respond(res, "BAD_REQUEST", "File upload error", {
          errors: { "body.files": err.message },
        });
    }
  }

  next(err);
};

export const requireFiles = (fieldName: string) => {
  return (req: any, res: any, next: any) => {
    const files = req.files || req.file;
    if (!files || (Array.isArray(files) && files.length === 0)) {
      const err = new multer.MulterError("LIMIT_FILE_REQUIRED" as ErrorCode);
      err.message = `No files uploaded for field '${fieldName}'`;
      return next(err);
    }
    next();
  };
};
