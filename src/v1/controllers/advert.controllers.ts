import { Response } from "express";
import createError from "http-errors";
import { RequestWithUser } from "../../../types";
import prisma from "../../client";
import { uploadService } from "../services/upload.service";

/**
 * @description - get all adverts
 * @route GET /api/adverts
 * @access Private
 * @returns  adverts
 */
const getAdverts = async (req: RequestWithUser, res: Response) => {

  try {
    const adverts = await prisma.advert.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(adverts);
  } catch (error) {
    throw new createError.BadRequest("Unable to get adverts");
  }
}




/**
 * @description - get advert by id
 * @route GET /api/adverts/:id
 * @access Private
 * @returns  advert
 */
const getAdvertById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;

  try {
    const advert = await prisma.advert.findUnique({
      where: {
        id: id,
      },
    });

    res.status(200).json(advert);
  } catch (error) {
    throw new createError.BadRequest("Unable to get advert");
  }
}

/**
 * @description - create advert
 * @route POST /api/adverts
 * @access Private
 * @returns {object} - success, message
 */
const createAdvert = async (req: RequestWithUser, res: Response) => {
  const { title, content, published, imageFile, videoUrl, videoTitle, videoDescription, author, summary  } = req.body;



  let imageUrl;
  if (imageFile && imageFile !== "") {
    imageUrl = await uploadService.uploadImageFile(imageFile);
  }

  try {
     await prisma.advert.create({
      data: {
        name: title,
        title,
        content,
        published,
        imageUrl: imageUrl?.secure_url as string,
        videoUrl,
        videoTitle,
        videoDescription,
        author,
        summary,
        authorId: req.user?.id as string,
      },
    });

    res.status(200).json({ success: true, message: "Advert created" });
  } catch (error) {
    throw new createError.BadRequest("Unable to create advert");
  }
}

/**
 * @description - update advert
 * @route PUT /api/adverts/:id
 * @access Private
 * @returns {object} - success, message
 */
const updateAdvert = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const { name, title, content, published, imageFile, videoUrl, videoTitle, videoDescription, author, summary,  } = req.body;
  
    let imageUrl;
    if (imageFile && imageFile !== "") {
      imageUrl = await uploadService.uploadImageFile(imageFile);
    }

  try {
    await prisma.advert.update({
      where: {
        id: id,
      },
      data: {
        name,
        title,
        content,
        published,
        imageUrl: imageUrl?.secure_url as string,
        videoUrl,
        videoTitle,
        videoDescription,
        author,
        summary,
        authorId: req.user?.id as string,
      },
    });

    res.status(200).json({ success: true, message: "Advert updated" });
  } catch (error) {
    throw new createError.BadRequest("Unable to update advert");
  }
}

/**
 * @description - delete advert
 * @route DELETE /api/adverts/:id
 * @access Private
 * @returns {object} - success, message
 */
const deleteAdvert = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.advert.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({ success: true, message: "Advert deleted" });
  } catch (error) {
    throw new createError.BadRequest("Unable to delete advert");
  }
}

export const advertController = {
    getAdverts,
    getAdvertById,
    createAdvert,
    updateAdvert,
    deleteAdvert,
};