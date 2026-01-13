import { cloudinaryV2 } from "@api/lib";

export const uploadToCloudinary = (buffer: Buffer, type: "image" | "video") => {
  return new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    cloudinaryV2.uploader
      .upload_stream(
        {
          resource_type: type,
          folder: "media",
          transformation:
            type === "image"
              ? [{ quality: "auto", fetch_format: "auto" }]
              : undefined,
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};
