import { Request, Response } from "express";
import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { RequestWithUser } from "../../types";
import editorService from "../services/editor.service";
import { uploadService } from "../services/upload.service";

const prisma = new PrismaClient();




/**
 * @description - This controller fetches all published counties
 * @param req 
 * @param res 
 */
const getPublishedCounties = async (req: RequestWithUser, res: Response) => {
  try {
    const counties = await prisma.county.findMany({
     where: {
        published: true,
      },
    });
    res.status(200).json(counties);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};


/**
 * 
 * @param req 
 * @param res 
 */
const addComment = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const comment: string = req.body.comment;
  if (!comment) {
    throw createError(400, "Missing required fields");
  }
  const data = {
    id,
    comment,
    userId: req.user?.id,
  }
  try {
    const newComment = await editorService.addComment(data)
    res.status(201).json(newComment);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};


/**
 * 
 * @param req 
 * @param res 
 */
const addCounty = async (req: RequestWithUser, res: Response) => {
  const { name, imageFile } = req.body;
  if (!name || name === "" || !imageFile || imageFile === "") {
    throw createError(400, "Missing required fields");
  }
   const imageUrl = await uploadService.uploadImageFile(imageFile);
  const data = {
    userId: req.user?.id,
    name,
    imageUrl: imageUrl.secure_url,
  };
  try {
    const newCounty = await editorService.addCounty(data);
    res.status(201).json(newCounty);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
    
};

/**
 * 
 * @param req 
 * @param res 
 */
const getCounties = async (req: RequestWithUser, res: Response) => {
  try {
    const counties = await editorService.getCounties();
    res.status(200).json(counties);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * 
 * @param req 
 * @param res 
 */
const getCountyById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw createError(400, "Missing required fields");
  }
  try {
    const county = await editorService.getCountyById({ id });
    res.status(200).json(county);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

const updateDistrictById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const { name, imageFile } = req.body;
  // if(!name || name === '' || !imageFile || imageFile === '') {
  //   throw createError(400, "Missing required fields");
  // }

  try {
    const imageUrl = await uploadService.uploadImageFile(imageFile);
    const data = {
      id,
      name,
      imageUrl: imageUrl.secure_url,
    };
    const updatedDistrict = await editorService.updateDistrictById(data);
    res.status(200).json(updatedDistrict);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
}


/**
 * 
 * @param req 
 * @param res 
 */
const updateCounty = async (
  req: RequestWithUser,
  res: Response
) => {
  const { id } = req.params;
  const { name, imageFile } = req.body;
  // if(!name || name === '' || !imageFile || imageFile === '') {
  //   throw createError(400, "Missing required fields");
  // }

  try {
    const imageUrl = await uploadService.uploadImageFile(imageFile);
    const data = {
      id,
      name,
      imageUrl: imageUrl.secure_url,
    }
    const updatedCounty = await editorService.updateCounty(data);
    res.status(200).json(updatedCounty);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * 
 * @param req 
 * @param res 
 */
const removeCounty = async (
  req: RequestWithUser,
  res: Response
) => {
  const { id } = req.params;
};


/**
 * 
 * @param req 
 * @param res 
 */
const addDistrict = async (req: RequestWithUser, res: Response) => {
  const { name, countyId } = req.body;
  // console.log("🚀 ~ file: editor.controller.ts ~ line 111 ~ addDistrict ~ body", req.body)
  if (!name || !countyId) {
    throw createError(400, "Missing required fields");
  }
  const data = {
    name,
    countyId,
  }
  try {
    const newDistrict = await editorService.addDistrict(data);
    res.status(201).json(newDistrict);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
}

/**
 * 
 * @param req 
 * @param res 
 */
const getDistrictById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw createError(400, "Missing required information");
  }
  try {
    const district = await editorService.getDistrictById({ id });
    res.status(200).json(district);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
}

/**
 * 
 * @param req 
 * @param res 
 */
const createDistrictWhyInvestIn = async (
  req: RequestWithUser,
  res: Response
) => {
  const { title, imageFile, content, districtId } = req.body;
  if (!title || !imageFile || !content || !districtId) {
    throw createError(400, "Missing required fields");
  }
  const imageUrl = await uploadService.uploadImageFile(imageFile);
  const data = {
    title,
    imageUrl: imageUrl.secure_url,
    content,
    districtId,
  }
  try {
    const district = await editorService.createDistrictWhyInvestIn(data);
    res.status(201).json(district);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};


/**
 * 
 * @param req 
 * @param res 
 */
const updateDistrictWhyInvestIn = async (
  req: RequestWithUser,
  res: Response
) => {
  const { title, imageFile, content, id } = req.body;
  if (!title || !imageFile || !content || !id) {
    throw createError(400, "Missing required fields");
  }
  const imageUrl = await uploadService.uploadImageFile(imageFile);
  const data = {
    title,
    imageUrl: imageUrl.secure_url,
    content,
    id,
  }
  try {
    const district = await editorService.updateDistrictWhyInvestIn(data);
    res.status(201).json(district);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

export {
  getPublishedCounties,
  addComment,
  getCounties,
  getCountyById,
  addCounty,
  updateCounty,
  removeCounty,
  addDistrict,
  getDistrictById,
  updateDistrictById,
  createDistrictWhyInvestIn,
  updateDistrictWhyInvestIn,
};

