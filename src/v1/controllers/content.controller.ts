import { Response } from "express";
import createError from "http-errors";
import { PrismaClient, SourceDirectoryType } from "@prisma/client";
import { RequestWithUser } from "../../../types";
import editorService from "../services/editor.service";
import { uploadService } from "../services/upload.service";
import { PartialSectionSchemaProps } from "../../schema/Section";

const prisma = new PrismaClient();

/**
 * @description - This controller fetches all published counties
 * @route GET /feed
 * @access Private
 * @param req
 * @param res
 */
const publicFeed = async (req: RequestWithUser, res: Response) => {
  try {
    const counties = await prisma.county.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
        logoIcon: true,
      },
    });

    res.status(200).json({ counties });
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description - This controller fetches all published counties
 * @route GET /feed
 * @access Private
 * @param req
 * @param res
 */
const getPublishedContent = async (req: RequestWithUser, res: Response) => {
  const { pageNumber } = req.params;
  const TAKE = 10;
  const SKIP = (Number(pageNumber) - 1) * TAKE;

  try {
    const counties = await prisma.county.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        logoIcon: true,
        createdAt: true,
        updatedAt: true,
        welcome: true,
        lep: true,
        news: true,
        districts: {
          select: {
            id: true,
            name: true,
            isLive: true,
            imageUrl: true,
            logoIcon: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    res.status(200).json({ counties });
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description - This controller fetches all sections by county id and page number
 * @param req 
 * @param res 
 */
const getFeedContent = async (req: RequestWithUser, res: Response) => {
  const { countyId, page } = req.params;
  const TAKE = 10;
  const PAGE_NUMBER = +page;
  const SKIP = (PAGE_NUMBER - 1) * TAKE;

  try {
    const sections = await prisma.section.findMany({
      where:{
        countyId: countyId
      },
      select: {
        id: true,
        name: true,
        title: true,
        isLive: true,
        content: true,
        imageUrl: true,
        author: true,
        summary: true,
        videoUrl: true,
        videoTitle: true,
        videoDescription: true,
        countyId: true,
        updatedAt: true,
      },
    });

    const subSections = await prisma.subSection.findMany({
      skip: SKIP,
      take: TAKE,
      where: {
        section: {
          countyId: countyId,
        },
      },
      select: {
        id: true,
        name: true,
        title: true,
        isLive: true,
        content: true,
        imageUrl: true,
        author: true,
        summary: true,
        videoUrl: true,
        videoTitle: true,
        videoDescription: true,
        sectionId: true,
        updatedAt: true,
      },
    });

    let content;
    if(PAGE_NUMBER === 1  ){
       const foundSection = sections?.find(
         (section) => section.name === "Corporate Social Responsibility (CSR)"
       );
       
       content = [foundSection,...subSections];
       res.status(200).json({ content });
    } else {
      res.status(200).json({ subSections });
    }
  }catch (error) {
     if (error instanceof Error) {
       throw createError(400, error.message);
     }
     throw createError(400, "Invalid request");
  }
};



const searchContent = async (req: RequestWithUser, res: Response) => {
  const { query } = req.params;
  try {
    const results = await editorService.searchContent(query);
    res.status(200).json(results);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description - This controller creates a comment
 * @route POST /comment
 * @access Private
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
 * @description controller to create a section
 * @route POST /county
 * @access Private
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
 * @description - This controller fetches all counties
 * @route GET /county
 * @access Private
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
 * @description - This controller gets a county by Id
 * @route PUT /county/:id
 * @access Private
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
 * @description - This controller updates a county by Id
 * @route PUT /county/:id
 * @access Private
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
 * @description - This controller deletes a county by Id
 * @route DELETE /county/:id
 * @access Private
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
 * @description - This controller deletes many counties
 * @route DELETE /delete-counties
 * @access Private
 * @param req
 * @param res
 */
const removeManyCounties = async (req: RequestWithUser, res: Response) => {
  try {
    const removedCounties = await editorService.removeManyCounties({
      ...req.body,
    });
    res.status(200).json(removedCounties);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description - This controller creates a district
 * @route POST /district
 * @access Private
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
 * @route GET /district
 * @access Private
 * @param req
 * @param res
 */
const getAllDistricts = async (req: RequestWithUser, res: Response) => {
  try {
    const districts = await editorService.getAllDistricts();
    res.status(200).json(districts);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description - This controller fetches all districts by county id
 * @route GET /editor/district/:id
 * @access Private
 * @param req
 * @param res
 */
const getDistrictsByCountyId = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
   if (!id) {
     throw createError(400, "Missing required information");
   }
  try {
    const districts = await editorService.getDistrictsByCountyId(id);
    res.status(200).json(districts);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description - This controller gets a district by Id
 * @route PUT /district/:id
 * @access Private
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
 * @description - This controller updates a district by Id
 * @route PUT /district/:id
 * @access Private
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
 * @description - This controller deletes a district by Id
 * @route DELETE /district/:id
 * @access Private
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
 * @description - This controller deletes many districts
 * @route DELETE /delete-districts
 * @access Private
 * @param req
 * @param res
 */
const deleteManyDistricts = async (req: RequestWithUser, res: Response) => {
  try {
    const deletedDistricts = await editorService.deleteManyDistricts({
      ...req.body,
    });
    res.status(200).json(deletedDistricts);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to create a new section
 * @route POST /section
 * @access Private
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
 * @route GET /section
 * @access Private
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
 * @route GET /section/:id
 * @access Private
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
 * @route PUT /section/:id
 * @access Private
 * @param req
 * @param res
 */
const updateSectionById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const {
    title,
    content,
    isLive,
    author,
    summary,
    imageFile,
    name,
    videoUrl,
    videoTitle,
    videoDescription,
  } = req.body;

  let imageUrl;
  if (imageFile && imageFile !== "") {
    imageUrl = await uploadService.uploadImageFile(imageFile);
  }
  const data: PartialSectionSchemaProps = {
    id,
    title,
    content,
    isLive,
    imageUrl: imageUrl?.secure_url as string,
    author,
    summary,
    name,
    videoUrl,
    videoTitle,
    videoDescription,
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
 * @route DELETE /section/:id
 * @access Private
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
 * @description controller to delete a section
 * @route DELETE /delete-sections
 * @access Private
 * @param req
 * @param res
 */
const deleteManySections = async (req: RequestWithUser, res: Response) => {
  try {
    const deletedSections = await editorService.deleteManySections({
      ...req.body,
    });
    res.status(200).json(deletedSections);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to create a new subsection
 * @route POST /subsection
 * @access Private
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
 * @route GET /subsection/:id
 * @access Private
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
 * @route PUT /subsection/:id
 * @access Private
 * @param req
 * @param res
 */
const updateSubsectionById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const {
    title,
    content,
    isLive,
    author,
    summary,
    imageFile,
    name,
    videoUrl,
    videoTitle,
    videoDescription,
  } = req.body;

  let imageUrl;
  if (imageFile && imageFile !== "") {
    imageUrl = await uploadService.uploadImageFile(imageFile);
  }

  const data: PartialSectionSchemaProps = {
    id,
    title,
    content,
    isLive,
    imageUrl: imageUrl?.secure_url as string,
    author,
    summary,
    name,
    videoUrl,
    videoTitle,
    videoDescription,
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
 * @description controller to delete a subsection by Id
 * @route DELETE /subsection/:id
 * @access Private
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
 * @description controller to delete many subsections
 * @route DELETE /delete-subsections
 * @access Private
 * @param req
 * @param res
 */
const deleteManySubsections = async (req: RequestWithUser, res: Response) => {
  try {
    const deletedSubsections = await editorService.deleteManySubsections({
      ...req.body,
    });
    res.status(200).json(deletedSubsections);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};


/**
 * @description controller to get sub-subsections by section id
 * @route GET /sub-subsections/:id
 * @access Private
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
      id,
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
 * @description controller to create a district section
 * @route POST /district-section
 * @access Private
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
 * @description controller to get a district section by id
 * @route GET /district-section/:id
 * @access Private
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
 * @description controller to get district sections by district id
 * @route GET /district-sections/:id
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
      await editorService.getDistrictSectionsByDistrictId({ id });
    res.status(200).json(districtSections);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to update a district section by id
 * @route PUT /district-section/:id
 * @access Private
 * @param req
 * @param res
 */
const updateDistrictSectionById = async (
  req: RequestWithUser,
  res: Response
) => {
  const { id } = req.params;
  const {
    title,
    content,
    countyId,
    imageFile,
    isLive,
    author,
    summary,
    name,
    videoUrl,
    videoTitle,
    videoDescription,
  } = req.body;

  let imageUrl;
  if (imageFile && imageFile !== "") {
    imageUrl = await uploadService.uploadImageFile(imageFile);
  }

  const data: PartialSectionSchemaProps = {
    id,
    title,
    content,
    isLive,
    imageUrl: imageUrl?.secure_url as string,
    author,
    summary,
    name,
    videoUrl,
    videoTitle,
    videoDescription,
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
 * @description controller to delete a district section by Id
 * @route DELETE /district-section/:id
 * @access Private
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
 * @description controller to delete many district sections
 * @route DELETE /delete-district-sections
 * @access Private
 * @param req
 * @param res
 */
const deleteManyDistrictSections = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const deletedSections = await editorService.deleteManyDistrictSections({
      ...req.body,
    });
    res.status(200).json(deletedSections);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to create an economic data widget
 * @route POST /economic-data
 * @access Private
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
    districtSectionId,
  } = req.body;
  const data = {
    title,
    stats,
    descriptionLine1,
    descriptionLine2,
    linkName,
    linkUrl,
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
 * @description controller to get an economic data widget by id
 * @route GET /economic-data/:id
 * @access Private
 * @param req
 * @param res
 */
const getEconomicDataWidgets = async (
  req: RequestWithUser,
  res: Response
) => {
  const { id } = req.params;
  try {
    const economicData = await editorService.getEconomicDataWidgets({ districtSectionId: id });
    res.status(200).json(economicData);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to get an economic data widget by id
 * @route GET /economic-data/:id
 * @access Private
 * @param req
 * @param res
 */
const getEconomicDataWidgetById = async (
  req: RequestWithUser,
  res: Response
) => {
  const { id } = req.params;
  try {
    const economicData = await editorService.getEconomicDataWidgetById({ id });
    res.status(200).json(economicData);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to get economic data widgets by id
 * @route GET /economic-data/:id
 * @access Private
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
    const response = await editorService.updateEconomicDataWidgetById(data);
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to delete an economic data widget by id
 * @route DELETE /economic-data/:id
 * @access Private
 * @param req
 * @param res
 */
const deleteEconomicDataWidgetById = async (
  req: RequestWithUser,
  res: Response
) => {
  const { id } = req.params;
  try {
    const response = await editorService.deleteEconomicDataWidgetById({ id });
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to delete many economic data widgets
 * @route DELETE /delete-ed-widgets
 * @access Private
 * @param req
 * @param res
 */
const deleteManyEconomicDataWidgets = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const response = await editorService.deleteManyEconomicDataWidgets({
      ...req.body,
    });
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to create (if Welcome data not present) or update county Welcome section
 * @route POST /county-welcome
 * @access Private
 * @param req
 * @param res
 */
const updateOrCreateCountyWelcome = async (
  req: RequestWithUser,
  res: Response
) => {
  const {
    title,
    content,
    countyId,
    imageFile,
    author,
    summary,
    id,
    isLive,
    videoUrl,
    videoTitle,
    videoDescription,
    name,
  } = req.body;

  let imageUrl;
  if (imageFile && imageFile !== "") {
    imageUrl = await uploadService.uploadImageFile(imageFile);
  }

  const data: PartialSectionSchemaProps = {
    title,
    content,
    countyId,
    id,
    isLive,
    imageUrl: imageUrl?.secure_url as string,
    author,
    summary,
    videoUrl,
    videoTitle,
    videoDescription,
    name,
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
 * @description controller to create (if News data not present) or update county News section
 * @route POST /county-news
 * @access Private
 * @param req
 * @param res
 */
const updateOrCreateCountyNews = async (
  req: RequestWithUser,
  res: Response
) => {
  const {
    title,
    content,
    countyId,
    imageFile,
    author,
    summary,
    id,
    isLive,
    videoUrl,
    videoTitle,
    videoDescription,
    name,
  } = req.body;

  let imageUrl;
  if (imageFile && imageFile !== "") {
    imageUrl = await uploadService.uploadImageFile(imageFile);
  }

  const data: PartialSectionSchemaProps = {
    title,
    content,
    countyId,
    id,
    isLive,
    imageUrl: imageUrl?.secure_url as string,
    author,
    summary,
    videoUrl,
    videoTitle,
    videoDescription,
    name,
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
 * @description controller to create (if LEP data not present) or update county LEP section
 * @route POST /county-lep
 * @access Private
 * @param req
 * @param res
 */
const updateOrCreateCountyLEP = async (req: RequestWithUser, res: Response) => {
  const {
    title,
    content,
    countyId,
    imageFile,
    author,
    summary,
    id,
    isLive,
    videoUrl,
    videoTitle,
    videoDescription,
    name,
  } = req.body;

  let imageUrl;
  if (imageFile && imageFile !== "") {
    imageUrl = await uploadService.uploadImageFile(imageFile);
  }

  const data: PartialSectionSchemaProps = {
    title,
    content,
    countyId,
    id,
    isLive,
    imageUrl: imageUrl?.secure_url as string,
    author,
    summary,
    videoUrl,
    videoTitle,
    videoDescription,
    name,
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
 * @route POST /source-directory
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
};

/**
 * @description controller to GET all source directory data
 * @route GET /source-directory
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
};

/**
 * @description controller to GET source directory data by type
 * @route GET /source-directory/:type
 * @access Private
 */
const getSDDataByType = async (req: RequestWithUser, res: Response) => {
  const { type } = req.params;
  try {
    const sourceDirectoryData = await editorService.getSDDataByType(
      type as SourceDirectoryType
    );

    res.status(201).json(sourceDirectoryData);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to UPDATE source directory data by id
 * @route PATCH /source-directory/:id
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
    id,
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
};

/**
 * @description controller to DELETE source directory data by id
 * @route DELETE /source-directory/:id
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
};

/**
 * @description controller to DELETE many source directory data
 * @route DELETE /delete-source-directories/:type
 * @access Private
 * @param req
 * @param res
 */
const deleteManySDData = async (req: RequestWithUser, res: Response) => {
  const { type } = req.params;
  try {
    const response = await editorService.deleteManySDData({
      type,
      ...req.body,
    });
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};


/**
 * @description controller to generate a PDF document for table data
 * @route getPublishedContent /generate-pdf
 * @access Private
 * @param req
 * @param res
 */
const generatePDF = async (req: RequestWithUser, res: Response) => {
  const {title, html } = req.body;
  try {
    const response = await editorService.generatePDF({title, html});
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="table.pdf"');
    res.send(response);
  } catch (error) {
    throw createError(400, "Invalid request");
  }
};

const contentController = {
  addCounty,
  getCounties,
  getPublishedContent,
  getFeedContent,
  getCountyById,
  updateCounty,
  removeCounty,
  removeManyCounties,
  addComment,
  addDistrict,
  getAllDistricts,
  getDistrictsByCountyId,
  getDistrictById,
  updateDistrictById,
  deleteDistrictById,
  deleteManyDistricts,
  createSection,
  getSections,
  getSectionById,
  updateSectionById,
  deleteSection,
  deleteManySections,
  createSubsection,
  getSubsectionById,
  getSubSectionsBySectionId,
  updateSubsectionById,
  deleteSubsection,
  deleteManySubsections,
  createDistrictSection,
  getDistrictSectionById,
  updateDistrictSectionById,
  deleteDistrictSection,
  deleteManyDistrictSections,
  createEconomicDataWidget,
  getEconomicDataWidgets,
  getEconomicDataWidgetById,
  updateEconomicDataWidgetById,
  deleteEconomicDataWidgetById,
  deleteManyEconomicDataWidgets,
  updateOrCreateCountyWelcome,
  updateOrCreateCountyNews,
  updateOrCreateCountyLEP,
  getDistrictSectionsByDistrictId,
  createSDData,
  getAllSDData,
  getSDDataByType,
  updateSDData,
  deleteSDData,
  deleteManySDData,
  searchContent,
  publicFeed,
  generatePDF,
};

export default contentController;