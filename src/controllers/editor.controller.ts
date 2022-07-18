import { Response } from "express";
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

const updateDistrictById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const { name, imageFile } = req.body;

  try {
    const imageUrl = await uploadService.uploadImageFile(imageFile);
    console.log("success");
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
};

/**
 *
 * @param req
 * @param res
 */
const updateCounty = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const { name, imageFile } = req.body;
  // console.log("🚀 ~ file: editor.controller.ts ~ line 145 ~ updateCounty ~ imageFile", imageFile)
  let imageUrl;
  if(imageFile){
    imageUrl = await uploadService.uploadImageFile(imageFile);
    console.log('uploaded image')
  }
  try {
    const data = {
      id,
      name,
      imageUrl: imageUrl?.secure_url,
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
 * @description controller to create a new section
 * @param req 
 * @param res 
 */
const createSection = async (req: RequestWithUser, res: Response) => {
  const { name, id, isSubSection } = req.body;

  const data = {
  
    name,
    countyId: id,
    isSubSection
  };
  console.log(
    "🚀 ~ file: editor.controller.ts ~ line 232 ~ createSection ~ data",
    data
  );
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
 * @description controller to get a section by id
 * @param req 
 * @param res 
 */
const getSectionById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  console.log("🚀 ~ file: editor.controller.ts ~ line 259 ~ getSectionById ~ id", id)
  
  try {
    const section = await editorService.getSectionById({ id });
    res.status(200).json(section);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
}

/**
 * @description controller to update a section
 * @param req 
 * @param res 
 */
const updateSectionById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const { title, content, isLive } = req.body;

  const data = {
    id,
    title,
    content,
    isLive
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
}

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
}

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
    isSubSubSection: isSubSection
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
}

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
}

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
    isLive
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
}

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
}
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
}

/**
 * @description controller to get a subsection by id
 * @param req 
 * @param res 
 */
const getSubSubSectionById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  console.log("🚀 ~ file: editor.controller.ts ~ line 429 ~ getSubSubSectionById ~ id", id)
  try {
    const subSubSection = await editorService.getSubSubSectionById({ id });
    res.status(200).json(subSubSection);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
}

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
    isLive
  };
  try {
    const updatedSubSubSection = await editorService.updateSubSubSectionById(data);
    res.status(200).json(updatedSubSubSection);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
}

/**
 * @description controller to delete a subsection
 * @param req 
 * @param res 
 */
const deleteSubSubSectionById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  try {
    const deletedSubSubSection = await editorService.deleteSubSubSectionById({ id });
    res.status(200).json(deletedSubSubSection);
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
const updateOrCreateDistrictWhyInvestIn = async (
  req: RequestWithUser,
  res: Response
) => {
  const { title, imageFile, content, districtId, id } = req.body;
  let imageUrl;
  if (imageFile && imageFile !== "") {
    imageUrl = await uploadService.uploadImageFile(imageFile);
  }
  const data = {
    title,
    imageUrl: imageUrl?.secure_url,
    content,
    districtId,
    id,
  };
  console.log("processing");
  try {
    const district = await editorService.updateOrCreateDistrictWhyInvestIn(
      data
    );
    console.log("success");
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
const updateOrCreateEconomicData = async (
  req: RequestWithUser,
  res: Response
) => {
  const { id } = req.params;
  const {
    workingAgePopulation,
    labourDemand,
    noOfRetailShops,
    unemploymentRate,
    employmentInvestmentLand,
    numOfRegisteredCompanies,
    numOfBusinessParks,
    averageHousingCost,
    averageWageEarnings,
    districtId,
  } = req.body;

  const data = {
    workingAgePopulation,
    labourDemand,
    noOfRetailShops,
    unemploymentRate,
    employmentInvestmentLand,
    numOfRegisteredCompanies,
    numOfBusinessParks,
    averageHousingCost,
    averageWageEarnings,
    districtId,
    id,
  };

  try {
    const district = await editorService.updateOrCreateEconomicData(data);
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
const updateOrCreateDistrictBusinessParks = async (
  req: RequestWithUser,
  res: Response
) => {
  const { title, imageFile, content, districtId, id } = req.body;
  let imageUrl;
  if (imageFile && imageFile !== "") {
    imageUrl = await uploadService.uploadImageFile(imageFile);
  }
  const data = {
    title,
    imageUrl: imageUrl?.secure_url,
    content,
    districtId,
    id,
  };
  console.log("processing");
  try {
    const district = await editorService.updateOrCreateDistrictBusinessParks(
      data
    );
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
const updateOrCreateDistrictCouncilGrants = async (
  req: RequestWithUser,
  res: Response
) => {
  const { title, imageFile, content, districtId, id } = req.body;
  let imageUrl;
  if (imageFile && imageFile !== "") {
    imageUrl = await uploadService.uploadImageFile(imageFile);
  }
  const data = {
    title,
    imageUrl: imageUrl?.secure_url,
    content,
    districtId,
    id,
  };
  try {
    const district = await editorService.updateOrCreateDistrictCouncilGrants(
      data
    );
    console.log("success");
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
const updateOrCreateDistrictCouncilServices = async (
  req: RequestWithUser,
  res: Response
) => {
  const { title, imageFile, content, districtId, id } = req.body;
  let imageUrl;
  if (imageFile && imageFile !== "") {
    imageUrl = await uploadService.uploadImageFile(imageFile);
  }
  const data = {
    title,
    imageUrl: imageUrl?.secure_url,
    content,
    districtId,
    id,
  };
  try {
    const district = await editorService.updateOrCreateDistrictCouncilServices(
      data
    );
    console.log("success");
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
const updateOrCreateDistrictLocalNews = async (
  req: RequestWithUser,
  res: Response
) => {
  const { title, imageFile, content, districtId, id } = req.body;
  let imageUrl;
  if (imageFile && imageFile !== "") {
    imageUrl = await uploadService.uploadImageFile(imageFile);
  }
  const data = {
    title,
    imageUrl: imageUrl?.secure_url,
    content,
    districtId,
    id,
  };
  try {
    const district = await editorService.updateOrCreateDistrictLocalNews(data);
    console.log("success");
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
const updateOrCreateCountyWelcome = async (
  req: RequestWithUser,
  res: Response
) => {
  const { title, content, countyId, id } = req.body;

  const data = {
    title,
    content,
    countyId,
    id,
  };
  try {
    const updatedWelcome = await editorService.updateOrCreateCountyWelcome(
      data
    );
    console.log("success");
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
  const { title, content, countyId, id } = req.body;

  const data = {
    title,
    content,
    countyId,
    id,
  };
  try {
    const updatedNews = await editorService.updateOrCreateCountyNews(data);
    console.log("success");
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
  const { title, content, countyId, id } = req.body;

  const data = {
    title,
    content,
    countyId,
    id,
  };
  try {
    const updatedLEP = await editorService.updateOrCreateCountyLEP(data);
    console.log("success");
    res.status(201).json(updatedLEP);
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
  createSection,
  getSectionById,
  updateSectionById,
  deleteSection,
  createSubsection,
  getSubsectionById,
  updateSubsectionById,
  deleteSubsection,
  createSubSubSection,
  getSubSubSectionById,
  updateSubSubSectionById,
  deleteSubSubSectionById,
  updateOrCreateDistrictWhyInvestIn,
  updateOrCreateEconomicData,
  updateOrCreateDistrictBusinessParks,
  updateOrCreateDistrictCouncilGrants,
  updateOrCreateDistrictCouncilServices,
  updateOrCreateDistrictLocalNews,
  updateOrCreateCountyWelcome,
  updateOrCreateCountyNews,
  updateOrCreateCountyLEP,
};
