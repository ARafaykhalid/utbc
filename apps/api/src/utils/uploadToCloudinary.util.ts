import cloudinary from "@/lib/cloudinary.lib";

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<{ url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          format: "webp", // modern
          quality: "auto",
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      )
      .end(buffer);
  });
};
