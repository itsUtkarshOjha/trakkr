import { UploadApiResponse } from "cloudinary";
import cloudinary from ".";

export const uploadImage = async (image: Buffer) => {
  try {
    const uploadResult: UploadApiResponse | undefined = await new Promise(
      (resolve) => {
        cloudinary.uploader
          .upload_stream({ folder: "Wurkout" }, (error, uploadResult) => {
            return resolve(uploadResult);
          })
          .end(image);
      }
    );
    return uploadResult;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while uploading the image.");
  }
};
