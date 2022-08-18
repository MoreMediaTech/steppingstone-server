import { Response } from "express";
import createError from "http-errors";
import { PrismaClient, SourceDirectoryType } from "@prisma/client";
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

  const data = {
    id,
    comment,
    userId: req.user?.id,
  };
  try {
    const newComment = await editorService.addComment(data);
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
  const { name } = req.body;

  const data = {
    userId: req.user?.id,
    name,
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

/**
 *
 * @param req
 * @param res
 */
const updateCounty = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const { name, imageFile, published, logoFile } = req.body;

  let imageUrl;
  let logoUrl;
  if (imageFile) {
    imageUrl = await uploadService.uploadImageFile(imageFile);
  }
  if (logoFile) {
    logoUrl = await uploadService.uploadImageFile(logoFile);
  }
  try {
    const data = {
      id,
      name,
      imageUrl: imageUrl?.secure_url,
      published,
      logoIcon: logoUrl?.secure_url,
    };
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
const removeCounty = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  try {
    const removedCounty = await editorService.removeCounty({ id });
    res.status(200).json(removedCounty);
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
const addDistrict = async (req: RequestWithUser, res: Response) => {
  const { name, countyId } = req.body;
  if (!name || !countyId) {
    throw createError(400, "Missing required fields");
  }
  const data = {
    name,
    countyId,
  };
  try {
    const newDistrict = await editorService.addDistrict(data);
    res.status(201).json(newDistrict);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description - This controller fetches all districts
 * @param req
 * @param res
 */
const getDistricts = async (req: RequestWithUser, res: Response) => {
  try {
    const districts = await editorService.getDistricts();
    res.status(200).json(districts);
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
};

/**
 *
 * @param req
 * @param res
 */
const updateDistrictById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const { name, imageFile, isLive, logoFile } = req.body;

  let imageUrl;
  let logoUrl;
  if (imageFile) {
    imageUrl = await uploadService.uploadImageFile(imageFile);
  }
  if (logoFile) {
    logoUrl = await uploadService.uploadImageFile(logoFile);
  }

  try {
    const data = {
      id,
      name,
      isLive,
      imageUrl: imageUrl?.secure_url,
      logoIcon: logoUrl?.secure_url,
    };
    const updatedDistrict = await editorService.updateDistrictById(data);
    res.status(200).json(updatedDistrict);
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
const deleteDistrictById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw createError(
      400,
      "Unable to delete district. Missing required information"
    );
  }
  try {
    const district = await editorService.deleteDistrictById({ id });
    res.status(200).json(district);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to create a new section
 * @param req
 * @param res
 */
const createSection = async (req: RequestWithUser, res: Response) => {
  const { name, id, isSubSection } = req.body;

  const data = {
    name,
    countyId: id,
    isSubSection,
  };

  try {
    const newSection = await editorService.createSection(data);
    res.status(201).json(newSection);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to get all sections
 * @param req
 * @param res
 */
const getSections = async (req: RequestWithUser, res: Response) => {
  try {
    const sections = await editorService.getSections();
    res.status(200).json(sections);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to get a section by id
 * @param req
 * @param res
 */
const getSectionById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;

  try {
    const section = await editorService.getSectionById({ id });
    res.status(200).json(section);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to update a section
 * @param req
 * @param res
 */
const updateSectionById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const { title, content, isLive, isSubSection } = req.body;

  const data = {
    id,
    title,
    content,
    isLive,
    isSubSection,
  };
  try {
    const updatedSection = await editorService.updateSectionById(data);
    res.status(200).json(updatedSection);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to delete a section
 * @param req
 * @param res
 */
const deleteSection = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  try {
    const deletedSection = await editorService.deleteSection({ id });
    res.status(200).json(deletedSection);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to create a new subsection
 * @param req
 * @param res
 */
const createSubsection = async (req: RequestWithUser, res: Response) => {
  const { name, id, isSubSection } = req.body;

  const data = {
    name,
    sectionId: id,
    isSubSubSection: isSubSection,
  };
  try {
    const newSubsection = await editorService.createSubsection(data);
    res.status(201).json(newSubsection);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to get a subsection by id
 * @param req
 * @param res
 */
const getSubsectionById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  try {
    const subsection = await editorService.getSubsectionById({ id });
    res.status(200).json(subsection);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to update a subsection
 * @param req
 * @param res
 */
const updateSubsectionById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const { title, content, isLive } = req.body;

  const data = {
    id,
    title,
    content,
    isLive,
  };
  try {
    const updatedSubsection = await editorService.updateSubsectionById(data);
    res.status(200).json(updatedSubsection);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to delete a subsection
 * @param req
 * @param res
 */
const deleteSubsection = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  try {
    const deletedSubsection = await editorService.deleteSubsection({ id });
    res.status(200).json(deletedSubsection);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};
/**
 * @description controller to create a new subsection
 * @param req
 * @param res
 */
const createSubSubSection = async (req: RequestWithUser, res: Response) => {
  const { name, id } = req.body;

  const data = {
    name,
    subSectionId: id,
  };
  try {
    const newSubSubSection = await editorService.createSubSubSection(data);
    res.status(201).json(newSubSubSection);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to get a subsection by id
 * @param req
 * @param res
 */
const getSubSubSectionById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  console.log(
    "🚀 ~ file: editor.controller.ts ~ line 429 ~ getSubSubSectionById ~ id",
    id
  );
  try {
    const subSubSection = await editorService.getSubSubSectionById({ id });
    res.status(200).json(subSubSection);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};


/**
 * @description controller to get subsections by section id
 * @param req
 * @param res
 */
const getSubSectionsBySectionId = async (
  req: RequestWithUser,
  res: Response
) => {
  const { id } = req.params;
  try {
    const subSections = await editorService.getSubSectionsBySectionId({
      sectionId: id,
    });
    res.status(200).json(subSections);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to update a subsection
 * @param req
 * @param res
 */
const updateSubSubSectionById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const { title, content, isLive } = req.body;

  const data = {
    id,
    title,
    content,
    isLive,
  };
  try {
    const updatedSubSubSection = await editorService.updateSubSubSectionById(
      data
    );
    res.status(200).json(updatedSubSubSection);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to delete a subsection
 * @param req
 * @param res
 */
const deleteSubSubSectionById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  try {
    const deletedSubSubSection = await editorService.deleteSubSubSectionById({
      id,
    });
    res.status(200).json(deletedSubSubSection);
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
const createDistrictSection = async (req: RequestWithUser, res: Response) => {
  const { name, districtId, isEconomicData } = req.body;

  const data = {
    name,
    districtId,
    isEconomicData,
  };

  try {
    const newDistrictSection = await editorService.createDistrictSection(data);
    res.status(201).json(newDistrictSection);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to get a section by id
 * @param req
 * @param res
 */
const getDistrictSectionById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;

  try {
    const districtSection = await editorService.getDistrictSectionById({ id });
    res.status(200).json(districtSection);
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
const getDistrictSectionsByDistrictId = async (
  req: RequestWithUser,
  res: Response
) => {
  const { id } = req.params;

  try {
    const districtSections =
      await editorService.getDistrictSectionsByDistrictId({ districtId: id });
    res.status(200).json(districtSections);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to update a section
 * @param req
 * @param res
 */
const updateDistrictSectionById = async (
  req: RequestWithUser,
  res: Response
) => {
  const { id } = req.params;
  const { title, content, imageFile, isLive } = req.body;
  let imageUrl;
  if (imageFile && imageFile !== "") {
    imageUrl = await uploadService.uploadImageFile(imageFile);
  }
  const data = {
    id,
    title,
    content,
    isLive,
    imageUrl: imageUrl?.secure_url,
  };
  try {
    const updatedSection = await editorService.updateDistrictSectionById(data);
    res.status(200).json(updatedSection);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to delete a section
 * @param req
 * @param res
 */
const deleteDistrictSection = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  try {
    const deletedSection = await editorService.deleteDistrictSection({ id });
    res.status(200).json(deletedSection);
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
const createEconomicDataWidget = async (
  req: RequestWithUser,
  res: Response
) => {
  const {
    title,
    stats,
    descriptionLine1,
    descriptionLine2,
    linkName,
    linkUrl,
    economicDataId,
    districtSectionId,
  } = req.body;
  const data = {
    title,
    stats,
    descriptionLine1,
    descriptionLine2,
    linkName,
    linkUrl,
    economicDataId,
    districtSectionId,
  };
  try {
    const district = await editorService.createEconomicDataWidget(data);
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
const getEconomicDataWidgetById = async (
  req: RequestWithUser,
  res: Response
) => {
  const { id } = req.params;
  try {
    const district = await editorService.getEconomicDataWidgetById({ id });
    res.status(200).json(district);
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
const updateEconomicDataWidgetById = async (
  req: RequestWithUser,
  res: Response
) => {
  const { id } = req.params;
  const {
    title,
    stats,
    descriptionLine1,
    descriptionLine2,
    linkName,
    linkUrl,
  } = req.body;
  const data = {
    title,
    stats,
    descriptionLine1,
    descriptionLine2,
    linkName,
    linkUrl,
    id,
  };
  try {
    const district = await editorService.updateEconomicDataWidgetById(data);
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
const deleteEconomicDataWidgetById = async (
  req: RequestWithUser,
  res: Response
) => {
  const { id } = req.params;
  try {
    const district = await editorService.deleteEconomicDataWidgetById({ id });
    res.status(200).json(district);
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
const updateOrCreateCountyWelcome = async (
  req: RequestWithUser,
  res: Response
) => {
  const { title, content, countyId, id, isLive } = req.body;

  const data = {
    title,
    content,
    countyId,
    id,
    isLive
  };
  try {
    const updatedWelcome = await editorService.updateOrCreateCountyWelcome(
      data
    );
    res.status(201).json(updatedWelcome);
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
const updateOrCreateCountyNews = async (
  req: RequestWithUser,
  res: Response
) => {
  const { title, content, countyId, id, isLive } = req.body;

  const data = {
    title,
    content,
    countyId,
    id,
    isLive
  };
  try {
    const updatedNews = await editorService.updateOrCreateCountyNews(data);
    res.status(201).json(updatedNews);
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
const updateOrCreateCountyLEP = async (req: RequestWithUser, res: Response) => {
  const { title, content, countyId, id, isLive } = req.body;

  const data = {
    title,
    content,
    countyId,
    id,
    isLive
  };
  try {
    const updatedLEP = await editorService.updateOrCreateCountyLEP(data);
    res.status(201).json(updatedLEP);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};


/**
 * @description controller to CREATE a source directory data
 * @route POST /api/v1/editor/source-directory
 * @access Private
 * @param req 
 * @param res 
 */
const createSDData = async (req: RequestWithUser, res: Response) => {
  // const { type, description, category, webLink, canEmail } = req.body;

  try {
    const response = await editorService.createSDData(req.body);
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
}


/**
 * @description controller to GET all source directory data
 * @route GET /api/v1/editor/source-directory
 * @access Private
 * @param req 
 * @param res 
 */
const getAllSDData = async (req: RequestWithUser, res: Response) => {
  try {
    const sourceDirectoryData = await editorService.getAllSDData();
    res.status(201).json(sourceDirectoryData);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
}


/**
 * @description controller to GET source directory data by type
 * @route GET /api/v1/editor/source-directory/:type
 * @access Private
 */
const getSDDataByType = async (req: RequestWithUser, res: Response) => {
  const { type } = req.params
  try {
     const sourceDirectoryData = await editorService.getSDDataByType(type as SourceDirectoryType);
      res.status(201).json(sourceDirectoryData);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
}


/**
 * @description controller to UPDATE source directory data by id
 * @route PATCH /api/v1/editor/source-directory/:id
 * @access Private
 * @param req 
 * @param res 
 */
const updateSDData = async (req: RequestWithUser, res: Response) => {
  const { type } = req.params;
  const { description, category, webLink, canEmail, id } = req.body;

  const data = {
    type,
    description,
    category,
    webLink,
    canEmail,
    id
  };
  try {
    const response = await editorService.updateSDData(data);
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
}

/**
 * @description controller to DELETE source directory data by id
 * @route DELETE /api/v1/editor/source-directory/:id
 * @access Private
 * @param req 
 * @param res 
 */
const deleteSDData = async (req: RequestWithUser, res: Response) => {
  const { type } = req.params;
  try {
    const response = await editorService.deleteSDData({ type, ...req.body });
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
}

export {
  getPublishedCounties,
  addComment,
  getCounties,
  getCountyById,
  addCounty,
  updateCounty,
  removeCounty,
  addDistrict,
  getDistricts,
  getDistrictById,
  updateDistrictById,
  deleteDistrictById,
  createSection,
  getSections,
  getSectionById,
  updateSectionById,
  deleteSection,
  createSubsection,
  getSubsectionById,
  getSubSectionsBySectionId,
  updateSubsectionById,
  deleteSubsection,
  createSubSubSection,
  getSubSubSectionById,
  updateSubSubSectionById,
  deleteSubSubSectionById,
  createDistrictSection,
  getDistrictSectionById,
  getDistrictSectionsByDistrictId,
  updateDistrictSectionById,
  deleteDistrictSection,
  createEconomicDataWidget,
  getEconomicDataWidgetById,
  updateEconomicDataWidgetById,
  deleteEconomicDataWidgetById,
  updateOrCreateCountyWelcome,
  updateOrCreateCountyNews,
  updateOrCreateCountyLEP,
  createSDData,
  getAllSDData,
  getSDDataByType,
  updateSDData,
  deleteSDData,
};
