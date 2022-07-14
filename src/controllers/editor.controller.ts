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
  const { title, countyId } = req.body;

  const data = {
    title,
    countyId,
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
}

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
}

/**
 * @description controller to update a section
 * @param req 
 * @param res 
 */
const updateSectionById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const data = {
    id,
    title,
    content,
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
  const { title, sectionId } = req.body;

  const data = {
    title,
    sectionId,
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
  const { title, content } = req.body;

  const data = {
    id,
    title,
    content,
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
const updateOrCreateFeatureArticle = async (
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
    const updatedFeatureArticle =
      await editorService.updateOrCreateFeatureArticle(data);
    console.log("success");
    res.status(201).json(updatedFeatureArticle);
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


/**
 *
 * @param req
 * @param res
 */
const updateOrCreateOnlineDigitilisation = async (
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
    const updatedOnlineDigitilisation =
      await editorService.updateOrCreateOnlineDigitilisation(data);
    console.log("success");
    res.status(201).json(updatedOnlineDigitilisation);
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
const updateOrCreateSocialEnterprises = async (
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
    const updatedSocialEnterprises =
      await editorService.updateOrCreateSocialEnterprises(data);
    console.log("success");
    res.status(201).json(updatedSocialEnterprises);
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
const updateOrCreateLGBTQAndDisabilities = async (
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
    const updatedLGBTQAndDisabilities =
      await editorService.updateOrCreateLGBTQAndDisabilities(data);
    console.log("success");
    res.status(201).json(updatedLGBTQAndDisabilities);
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
const updateOrCreateMHW = async (req: RequestWithUser, res: Response) => {
  const { title, content, countyId, id } = req.body;

  const data = {
    title,
    content,
    countyId,
    id,
  };
  try {
    const updatedMHW = await editorService.updateOrCreateMHW(data);
    console.log("success");
    res.status(201).json(updatedMHW);
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
const updateOrCreateHeritageAndTourism = async (
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
    const updatedHeritageAndTourism =
      await editorService.updateOrCreateHeritageAndTourism(data);
    console.log("success");
    res.status(201).json(updatedHeritageAndTourism);
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
const updateOrCreateCNZT = async (req: RequestWithUser, res: Response) => {
  const { title, content, countyId, id } = req.body;

  const data = {
    title,
    content,
    countyId,
    id,
  };
  try {
    const updatedCZNT = await editorService.updateOrCreateCNZT(data);
    console.log("success");
    res.status(201).json(updatedCZNT);
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
const updateOrCreateVatAndTax = async (req: RequestWithUser, res: Response) => {
  const { title, content, countyId, id } = req.body;

  const data = {
    title,
    content,
    countyId,
    id,
  };
  try {
    const updatedVatAndTax = await editorService.updateOrCreateVatAndTax(data);
    console.log("success");
    res.status(201).json(updatedVatAndTax);
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
const updateOrCreateMarketResearch = async (
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
    const updatedMarketResearch =
      await editorService.updateOrCreateMarketResearch(data);
    console.log("success");
    res.status(201).json(updatedMarketResearch);
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
const updateOrCreateLegalChecklist = async (
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
    const updatedLegalChecklist =
      await editorService.updateOrCreateLegalChecklist(data);
    console.log("success");
    res.status(201).json(updatedLegalChecklist);
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
const updateOrCreateFindStartupFunding = async (
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
    const updatedFindStartupFunding =
      await editorService.updateOrCreateFindStartupFunding(data);
    console.log("success");
    res.status(201).json(updatedFindStartupFunding);
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
const updateOrCreateBusinessPlan = async (
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
    const updatedBusinessPlan = await editorService.updateOrCreateBusinessPlan(
      data
    );
    console.log("success");
    res.status(201).json(updatedBusinessPlan);
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
const updateOrCreateBusinessInsurance = async (
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
    const updatedBusinessInsurance =
      await editorService.updateOrCreateBusinessInsurance(data);
    console.log("success");
    res.status(201).json(updatedBusinessInsurance);
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
const updateOrCreateBGB = async (req: RequestWithUser, res: Response) => {
  const { title, content, countyId, id } = req.body;
  console.log("🚀 ~ file: editor.controller.ts ~ line 973 ~ updateOrCreateBGB ~ body", req.body)

  const data = {
    title,
    content,
    countyId,
    id,
  };
  try {
    const updatedBGB = await editorService.updateOrCreateBGB(data);
    console.log("success");
    res.status(201).json(updatedBGB);
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
const updateOrCreateTradingOverseas = async (
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
    const updatedTradingOverseas =
      await editorService.updateOrCreateTradingOverseas(data);
    console.log("success");
    res.status(201).json(updatedTradingOverseas);
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
const updateOrCreateOME = async (req: RequestWithUser, res: Response) => {
  const { title, content, countyId, id } = req.body;

  const data = {
    title,
    content,
    countyId,
    id,
  };
  try {
    const updatedOME = await editorService.updateOrCreateOME(data);
    console.log("success");
    res.status(201).json(updatedOME);
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
const updateOrCreateImproveSkills = async (
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
    const updatedImproveSkills =
      await editorService.updateOrCreateImproveSkills(data);
    console.log("success");
    res.status(201).json(updatedImproveSkills);
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
const updateOrCreateFindTAndC = async (req: RequestWithUser, res: Response) => {
  const { title, content, countyId, id } = req.body;

  const data = {
    title,
    content,
    countyId,
    id,
  };
  try {
    const updatedFindTandC = await editorService.updateOrCreateFindTAndC(data);
    console.log("success");
    res.status(201).json(updatedFindTandC);
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
const updateOrCreateFindNewMarkets = async (
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
    const updatedFindNewMarkets =
      await editorService.updateOrCreateFindNewMarkets(data);
    console.log("success");
    res.status(201).json(updatedFindNewMarkets);
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
const updateOrCreateFindFunding = async (
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
    const updatedFindFunding = await editorService.updateOrCreateFindFunding(
      data
    );
    console.log("success");
    res.status(201).json(updatedFindFunding);
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
const updateOrCreateCommercialProperty = async (
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
    const updatedCommercialProperty =
      await editorService.updateOrCreateCommercialProperty(data);
    console.log("success");
    res.status(201).json(updatedCommercialProperty);
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
const updateOrCreateDevelopProductsAndServices = async (
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
    const updatedDevelopProductsAndServices =
      await editorService.updateOrCreateDevelopProductsAndServices(data);
    console.log("success");
    res.status(201).json(updatedDevelopProductsAndServices);
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
const updateOrCreateEmployPeople = async (
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
    const updatedEmployPeople = await editorService.updateOrCreateEmployPeople(
      data
    );
    console.log("success");
    res.status(201).json(updatedEmployPeople);
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
  updateOrCreateDistrictWhyInvestIn,
  updateOrCreateEconomicData,
  updateOrCreateDistrictBusinessParks,
  updateOrCreateDistrictCouncilGrants,
  updateOrCreateDistrictCouncilServices,
  updateOrCreateDistrictLocalNews,
  updateOrCreateFeatureArticle,
  updateOrCreateOnlineDigitilisation,
  updateOrCreateCountyWelcome,
  updateOrCreateCountyNews,
  updateOrCreateCountyLEP,
  updateOrCreateSocialEnterprises,
  updateOrCreateLGBTQAndDisabilities,
  updateOrCreateMHW,
  updateOrCreateHeritageAndTourism,
  updateOrCreateCNZT,
  updateOrCreateVatAndTax,
  updateOrCreateMarketResearch,
  updateOrCreateLegalChecklist,
  updateOrCreateFindStartupFunding,
  updateOrCreateBusinessPlan,
  updateOrCreateBusinessInsurance,
  updateOrCreateBGB,
  updateOrCreateTradingOverseas,
  updateOrCreateOME,
  updateOrCreateImproveSkills,
  updateOrCreateFindTAndC,
  updateOrCreateFindNewMarkets,
  updateOrCreateFindFunding,
  updateOrCreateCommercialProperty,
  updateOrCreateDevelopProductsAndServices,
  updateOrCreateEmployPeople,
};
