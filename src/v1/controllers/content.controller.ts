import { Request, Response } from "express";
import createError from "http-errors";
import { SectionType, SourceDirectoryType } from "@prisma/client";

import contentService from "../services/content.service";
import { uploadService } from "../services/upload.service";
import { PartialSectionSchemaProps } from "../../schema/Section";
import prisma from "../../client";

/**
 * @description - This controller fetches all the logo icons for the feed content
 * @route GET /feed
 * @access Private
 * @param req
 * @param res
 */
const publicFeed = async (req: Request, res: Response) => {
  try {
    const feedContent = await prisma.feedContent.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
        logoIcon: true,
      },
    });

    res.status(200).json({ feedContent });
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description - This controller fetches all published content
 * @route GET /feed
 * @access Private
 * @param req
 * @param res
 */
const getPublishedContent = async (req: Request, res: Response) => {
  try {
    const content = await prisma.feedContent.findMany({
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
      },
    });

    res.status(200).json(content);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};


/**
 * @description - This controller fetches all sections by feed content id and page number
 * @param req
 * @param res
 */
const getPublishedContentById = async (req: Request, res: Response) => {
  const { feedContentId } = req.params;
  const { page } = req.query;
  const PAGE_NUMBER = +(page as string);
  const TAKE = 7;
  const SKIP = (PAGE_NUMBER - 1) * TAKE;

  try {
    const feedSections = await prisma.section.findMany({
      where: {
        type: SectionType.CHILD_SECTION,
        parent: {
          feedContentId: feedContentId,
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
        feedContentId: true,
        updatedAt: true,
        createdAt: true,
      },
      take: TAKE,
      skip: SKIP,
    });

    const sections = await prisma.section.findMany({
      where: {
        type: SectionType.CHILD_SECTION,
        parent: {
          feedContentId: feedContentId,
        },
      },
    });

    const aboveTheFoldContent = await prisma.section.findMany({
      where: {
        type: SectionType.ABOVE_THE_FOLD_CONTENT,
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
        feedContentId: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    const numOfPages = Math.ceil(sections.length / TAKE);
    const totalSections = sections.length;

    res
      .status(200)
      .json({ sections: feedSections, aboveTheFoldContent, numOfPages, totalSections });
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

const searchContent = async (req: Request, res: Response) => {
  const { query } = req.params;
  try {
    const results = await contentService.searchContent(query);
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
const addComment = async (req: Request, res: Response) => {
  const { feedContentId, localFeedContentId } = req.params;
  const comment: string = req.body.comment;

  const data = {
    message: comment,
    authorId: req.user?.id,
    feedContentId,
    localFeedContentId,
  };
  try {
    const newComment = await contentService.addComment(data);
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
const createFeedContent = async (req: Request, res: Response) => {
  const { name } = req.body;

  const data = {
    authorId: req.user?.id,
    name,
  };
  try {
    const newCounty = await contentService.createFeedContent(data);
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
 * @route GET /feed-content
 * @access Private
 * @param req
 * @param res
 */
const getFeedContent = async (req: Request, res: Response) => {
  try {
    const counties = await contentService.getFeedContent();
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
 * @route PUT /feed-content/:id
 * @access Private
 * @param req
 * @param res
 */
const getFeedContentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const county = await contentService.getFeedContentById({ id });
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
 * @route PUT /feed-content/:id
 * @access Private
 * @param req
 * @param res
 */
const updateFeedContent = async (req: Request, res: Response) => {
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
    const updatedCounty = await contentService.updateFeedContent(data);
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
 * @route DELETE /feed-content/:id
 * @access Private
 * @param req
 * @param res
 */
const removeFeedContent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const removedCounty = await contentService.removeFeedContent({ id });
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
 * @route DELETE /feed-content
 * @access Private
 * @param req
 * @param res
 */
const removeManyFeedContent = async (req: Request, res: Response) => {
  try {
    const removedCounties = await contentService.removeManyFeedContent({
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
 * @description - This controller creates a local feed content
 * @route POST /local-feed
 * @access Private
 * @param req
 * @param res
 */
const createLocalFeed = async (req: Request, res: Response) => {
  const { name, feedContentId } = req.body;

  const data = {
    name,
    feedContentId,
  };
  try {
    const newDistrict = await contentService.createLocalFeed(data);
    res.status(201).json(newDistrict);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description - This controller fetches all local feed content
 * @route GET /local-feed
 * @access Private
 * @param req
 * @param res
 */
const getLocalFeed = async (req: Request, res: Response) => {
  try {
    const districts = await contentService.getLocalFeed();
    res.status(200).json(districts);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description - This controller fetches all local feed content by feed content id
 * @route GET /feed-content/local-feed/:id
 * @access Private
 * @param req
 * @param res
 */
const getLocalFeedByFeedContentId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const districts = await contentService.getLocalFeedByFeedContentId(id);
    res.status(200).json(districts);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description - This controller gets a local feed content by Id
 * @route PUT /local-feed/:id
 * @access Private
 * @param req
 * @param res
 */
const getLocalFeedById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const district = await contentService.getLocalFeedById({ id });
    res.status(200).json(district);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description - This controller updates a local feed content by Id
 * @route PUT /local-feed/:id
 * @access Private
 * @param req
 * @param res
 */
const updateLocalFeedById = async (req: Request, res: Response) => {
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
    const updatedDistrict = await contentService.updateLocalFeedById(data);
    res.status(200).json(updatedDistrict);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description - This controller deletes a local feed content by Id
 * @route DELETE /local-feed/:id
 * @access Private
 * @param req
 * @param res
 */
const deleteLocalFeedById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw createError(
      400,
      "Unable to delete district. Missing required information"
    );
  }
  try {
    const district = await contentService.deleteLocalFeedById({ id });
    res.status(200).json(district);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description - This controller deletes many local feed content
 * @route DELETE /local-feed
 * @access Private
 * @param req
 * @param res
 */
const deleteManyLocalFeedContent = async (req: Request, res: Response) => {
  try {
    const deletedDistricts = await contentService.deleteManyLocalFeedContent({
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
const createSection = async (req: Request, res: Response) => {
  const {
    name,
    localFeedContentId,
    feedContentId,
    parentId,
    isSubSection,
    type,
  } = req.body;

  const data = {
    name,
    localFeedContentId,
    feedContentId,
    parentId,
    isSubSection,
    type,
  };

  try {
    const newSection = await contentService.createSection(data);
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
const getSections = async (req: Request, res: Response) => {
  try {
    const sections = await contentService.getSections();
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
const getSectionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const section = await contentService.getSectionById({ id });
    res.status(200).json(section);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description controller to get a section by parent id
 * @route GET /section/:id
 * @access Private
 * @param req
 * @param res
 */
const getSectionByParentId = async (req: Request, res: Response) => {
  const { parentId } = req.params;

  try {
    const section = await contentService.getSectionByParentId({ parentId });
    res.status(200).json(section);
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
const getSectionByFeedContentId = async (req: Request, res: Response) => {
  const { feedContentId } = req.params;

  try {
    const section = await contentService.getSectionByFeedContentId({
      feedContentId,
    });
    res.status(200).json(section);
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
const getSectionByLocalFeedContentId = async (req: Request, res: Response) => {
  const { localFeedContentId } = req.params;

  try {
    const section = await contentService.getSectionByLocalFeedContentId({
      localFeedContentId,
    });
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
const updateSectionById = async (req: Request, res: Response) => {
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
    const updatedSection = await contentService.updateSectionById(data);
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
const deleteSection = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedSection = await contentService.deleteSection({ id });
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
const deleteManySections = async (req: Request, res: Response) => {
  try {
    const deletedSections = await contentService.deleteManySections({
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
const createEconomicDataWidget = async (req: Request, res: Response) => {
  const {
    title,
    stats,
    descriptionLine1,
    descriptionLine2,
    linkName,
    linkUrl,
    sectionId,
  } = req.body;
  const data = {
    title,
    stats,
    descriptionLine1,
    descriptionLine2,
    linkName,
    linkUrl,
    sectionId,
  };
  try {
    const response = await contentService.createEconomicDataWidget(data);
    res.status(201).json(response);
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
const getEconomicDataWidgets = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const economicData = await contentService.getEconomicDataWidgets({
      sectionId: id,
    });
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
const getEconomicDataWidgetById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const economicData = await contentService.getEconomicDataWidgetById({ id });
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
const updateEconomicDataWidgetById = async (req: Request, res: Response) => {
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
    const response = await contentService.updateEconomicDataWidgetById(data);
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
const deleteEconomicDataWidgetById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await contentService.deleteEconomicDataWidgetById({ id });
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
const deleteManyEconomicDataWidgets = async (req: Request, res: Response) => {
  try {
    const response = await contentService.deleteManyEconomicDataWidgets({
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
 * @description controller to CREATE a source directory data
 * @route POST /source-directory
 * @access Private
 * @param req
 * @param res
 */
const createSDData = async (req: Request, res: Response) => {
  // const { type, description, category, webLink, canEmail } = req.body;

  try {
    const response = await contentService.createSDData(req.body);
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
const getAllSDData = async (req: Request, res: Response) => {
  try {
    const sourceDirectoryData = await contentService.getAllSDData();

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
const getSDDataByType = async (req: Request, res: Response) => {
  const { type } = req.params;
  try {
    const sourceDirectoryData = await contentService.getSDDataByType(
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
const updateSDData = async (req: Request, res: Response) => {
  const { type } = req.params;
  const { description, category, webLink, canEmail, id } = req.body;

  const data = {
    type: type as SourceDirectoryType,
    description,
    category,
    webLink,
    canEmail,
    id,
  };
  try {
    const response = await contentService.updateSDData(data);
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
const deleteSDData = async (req: Request, res: Response) => {
  const { type } = req.params;
  try {
    const response = await contentService.deleteSDData({ type, ...req.body });
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
const deleteManySDData = async (req: Request, res: Response) => {
  const { type } = req.params;
  try {
    const response = await contentService.deleteManySDData({
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
const generatePDF = async (req: Request, res: Response) => {
  const { title, html } = req.body;
  try {
    const response = await contentService.generatePDF({ title, html });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="table.pdf"');
    res.send(response);
  } catch (error) {
    throw createError(400, "Invalid request");
  }
};

const contentController = {
  getPublishedContent,
  getPublishedContentById,
  createFeedContent,
  getFeedContent,
  getFeedContentById,
  updateFeedContent,
  removeFeedContent,
  removeManyFeedContent,
  addComment,
  createLocalFeed,
  getLocalFeed,
  getLocalFeedByFeedContentId,
  getLocalFeedById,
  updateLocalFeedById,
  deleteLocalFeedById,
  deleteManyLocalFeedContent,
  createSection,
  getSections,
  getSectionById,
  getSectionByParentId,
  getSectionByFeedContentId,
  getSectionByLocalFeedContentId,
  updateSectionById,
  deleteSection,
  deleteManySections,
  createEconomicDataWidget,
  getEconomicDataWidgets,
  getEconomicDataWidgetById,
  updateEconomicDataWidgetById,
  deleteEconomicDataWidgetById,
  deleteManyEconomicDataWidgets,
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
