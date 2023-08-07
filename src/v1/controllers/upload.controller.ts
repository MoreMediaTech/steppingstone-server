import { Request, Response } from "express";
import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { RequestWithUser } from "../../../types";
import { uploadService } from "../services/upload.service";
import { cloudinary } from "../../config/cloudinary";

const uploadImageFile = async (req: RequestWithUser, res: Response) => {
  try {
    const fileStr = req.body.data;
    const uploadResponse: cloudinary.UploadApiResponse =
      await uploadService.uploadImageFile(fileStr);
    res
      .status(201)
      .json({ success: true, imageUrl: uploadResponse.secure_url });
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

export { uploadImageFile };
