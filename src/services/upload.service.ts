import createError from "http-errors";
import { cloudinary } from "../config/cloudinary";

const uploadImageFile = async (fileStr: string) => {
    const uploadResponse = await cloudinary.v2.uploader.upload(fileStr, {
      upload_preset: "stepping-stones",
    });
    return uploadResponse;
}

export const uploadService = { uploadImageFile };


