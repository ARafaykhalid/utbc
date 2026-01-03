import multer, { MulterError } from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 5,
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (!allowed.includes(file.mimetype)) {
      const err = new MulterError("LIMIT_UNEXPECTED_FILE");
      err.message = `Unsupported file type for file (${file.originalname})`;
      return cb(err);
    }

    cb(null, true);
  },
});
