import createError from "http-errors";
import puppeteer from "puppeteer-core";
import { PrismaClient, SectionType, SourceDirectoryType } from "@prisma/client";

import { PartialSectionSchemaProps } from "../../schema/Section";
import { PartialFeedContentSchema } from "../../schema/FeedContent";
import { PartialCommentSchemaProps } from "../../schema/Comment";
import {
  PartialEconomicDataSchemaProps,
  PartialLocalFeedContentSchemaProps,
} from "../../schema/LocalFeedContent";
import { PartialSourceDirectoryProps } from "../../schema/SourceDirectory";

const prisma = new PrismaClient();

/**
 * @description - This function creates a new comment
 * @route POST /content/comment
 * @access Private
 * @param data
 * @returns  an object with a success status and a message
 */
const addComment = async (data: Partial<PartialCommentSchemaProps>) => {
  await prisma.comment.create({
    data: {
      message: data.message as string,
      author: { connect: { id: data.authorId } },
      feedContent: { connect: { id: data.id } },
      localFeedContent: { connect: { id: data.localFeedContentId as string } },
      parent: { connect: { id: data.parentId as string } },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Comment created successfully" };
};

// TODO: Look into this function
const searchContent = async (query: string) => {};

/**
 * @description - This creates a new feed content
 * @route POST /content/feed-content
 * @access Private
 * @param data
 * @returns  an object with a success status and a message
 */
const createFeedContent = async (data: PartialFeedContentSchema) => {
  const existingContent = await prisma.feedContent.findUnique({
    where: {
      name: data.name,
    },
  });
  if (existingContent) {
    throw createError(400, "Content already exists");
  }
  await prisma.feedContent.create({
    data: {
      name: data.name as string,
      author: { connect: { id: data.authorId } },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Feed content created successfully" };
};

/**
 * @description - This function gets a feed content by id
 * @route GET /content/feed-content/:id
 * @access Private
 * @param data
 * @returns  returns a feed content
 */
const getFeedContentById = async (data: PartialFeedContentSchema) => {
  const content = await prisma.feedContent.findUnique({
    where: {
      id: data.id,
    },
    select: {
      id: true,
      name: true,
      authorId: true,
      published: true,
      viewCount: true,
      localFeedContent: {
        select: {
          id: true,
          name: true,
          isLive: true,
          logoIcon: true,
        },
        orderBy: {
          name: "asc",
        },
      },
      imageUrl: true,
      logoIcon: true,
      sections: {
        select: {
          id: true,
          name: true,
          isSubSection: true,
          isLive: true,
          type: true,
        },
      },
    },
  });
  await prisma.$disconnect();
  return content;
};

/**
 * @description - This function gets all feed content
 * @route GET /content/feed-contents
 * @access Private
 * @returns a list of all feed content
 */
const getFeedContent = async () => {
  const content = await prisma.feedContent.findMany({
    select: {
      id: true,
      name: true,
      published: true,
      viewCount: true,
      createdAt: true,
      updatedAt: true,
      logoIcon: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  await prisma.$disconnect();
  return content;
};

/**
 * @description - This function gets all published feed content
 * @route GET /content/feed-content/published
 * @access Private
 * @returns a list of all feed content
 */
const getPublishedFeedContent = async () => {
  const content = await prisma.feedContent.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      name: true,
      published: true,
      localFeedContent: {
        select: {
          isLive: true,
        },
      },
      sections: {
        select: {
          isLive: true,
        },
      },
      viewCount: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  await prisma.$disconnect();
  return content;
};

/**
 * @description - This updates a feed content by id
 * @route PUT /content/feed-content/:id
 * @access Private
 * @returns  an object with a success status and a message
 */
const updateFeedContent = async (data: PartialFeedContentSchema) => {
  const content = await prisma.feedContent.findUnique({
    where: {
      id: data.id,
    },
  });

  if (content) {
    await prisma.feedContent.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name ? (data.name as string) : content.name,
        imageUrl: data.imageUrl ? (data.imageUrl as string) : content.imageUrl,
        logoIcon: data.logoIcon ? (data.logoIcon as string) : content.logoIcon,
        published: data.published
          ? (data.published as boolean)
          : content.published,
      },
    });
  }
  await prisma.$disconnect();
  return { success: true, message: "Feed content updated successfully" };
};

/**
 * @description - This function deletes a feed content by id
 * @route DELETE /content/feed-content/:id
 * @access Private
 * @returns  an object with a success status and a message
 */
const removeFeedContent = async (data: PartialFeedContentSchema) => {
  await prisma.feedContent.delete({
    where: {
      id: data.id,
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Feed content deleted successfully" };
};

/**
 * @description - This function deletes may counties
 * @route DELETE /content/feed-contents
 * @access Private
 * @returns  an object with a success status and a message
 */
const removeManyFeedContent = async (data: PartialFeedContentSchema) => {
  await prisma.feedContent.deleteMany({
    where: {
      id: {
        in: data.ids,
      },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Feed content deleted successfully" };
};

/**
 * @description - This creates a new district
 * @route POST /content/local-feed
 * @access Private
 * @param data
 * @returns   a new district
 */
const createLocalFeed = async (data: PartialLocalFeedContentSchemaProps) => {
  const existingLocalFeed = await prisma.localFeedContent.findUnique({
    where: {
      name: data.name,
    },
  });
  if (existingLocalFeed) {
    throw createError(400, "Local Feed already exists");
  }
  await prisma.localFeedContent.create({
    data: {
      name: data.name as string,
      feedContent: { connect: { id: data.feedContentId } },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Local feed content created successfully" };
};

/**
 * @description - This gets all local feed
 * @route GET /content/local-feed
 * @access Private
 * @returns a list of all local feed
 */
const getLocalFeed = async () => {
  const content = await prisma.localFeedContent.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      logoIcon: true,
      sections: true,
      isLive: true,
      feedContent: {
        select: {
          id: true,
          name: true,
          logoIcon: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  await prisma.$disconnect();
  return content;
};

/**
 * @description - This gets all local feed by feed content id
 * @route GET /feed-content/local-feed/:id
 * @access Private
 * @returns a list of all local feed by feed content id
 */
const getLocalFeedByFeedContentId = async (id: string) => {
  const content = await prisma.localFeedContent.findMany({
    where: {
      feedContentId: id,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      logoIcon: true,
      sections: true,
      isLive: true,
      feedContentId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  await prisma.$disconnect();
  return content;
};

/**
 * @description - This gets a local feed content by id
 * @route GET /content/local-feed/:id
 * @access Private
 * @returns a local feed content
 */
const getLocalFeedById = async (data: PartialLocalFeedContentSchemaProps) => {
  const content = await prisma.localFeedContent.findUnique({
    where: {
      id: data.id as string,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      logoIcon: true,
      isLive: true,
      sections: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  await prisma.$disconnect();
  return content;
};

/**
 * @description - This updates a local feed content by id
 * @route PUT /content/local-feed/:id
 * @access Private
 * @returns an object with a success status and a message
 */
const updateLocalFeedById = async (
  data: PartialLocalFeedContentSchemaProps
) => {
  const content = await prisma.localFeedContent.findUnique({
    where: {
      id: data.id,
    },
  });

  if (content) {
    await prisma.localFeedContent.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name ? (data.name as string) : content.name,
        imageUrl: data.imageUrl ? (data.imageUrl as string) : content.imageUrl,
        logoIcon: data.logoIcon ? (data.imageUrl as string) : content.logoIcon,
        isLive: data.isLive ? (data.isLive as boolean) : content.isLive,
      },
    });
  }
  await prisma.$disconnect();
  return { success: true, message: "Local feed content updated successfully" };
};

/**
 * @description - This deletes a local feed content by id
 * @route DELETE /content/local-feed/:id
 * @access Private
 * @returns an object with a success status and a message
 */
const deleteLocalFeedById = async (
  data: PartialLocalFeedContentSchemaProps
) => {
  await prisma.localFeedContent.delete({
    where: {
      id: data.id,
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Local feed content deleted successfully" };
};

/**
 * @description - This deletes many local feed content
 * @route DELETE /content/local-feed
 * @access Private
 * @returns an object with a success status and a message
 */
const deleteManyLocalFeedContent = async (
  data: PartialLocalFeedContentSchemaProps
) => {
  await prisma.localFeedContent.deleteMany({
    where: {
      id: {
        in: data.ids,
      },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Local feed content deleted successfully" };
};

/**
 * @description - This creates a new section under a county
 * @route POST /content/section
 * @access Private
 * @returns the newly created section
 */
const createSection = async (data: PartialSectionSchemaProps) => {
  if (data.type === SectionType.FEED_SECTION) {
    await prisma.section.create({
      data: {
        name: data.name as string,
        isSubSection: data.isSubSection as boolean,
        feedContent: { connect: { id: data.feedContentId } },
        type: data.type as SectionType,
      },
    });
  } else if (data.type === SectionType.LOCAL_FEED_SECTION) {
    await prisma.section.create({
      data: {
        name: data.name as string,
        isSubSection: data.isSubSection as boolean,
        localFeedContent: { connect: { id: data.localFeedContentId } },
        type: data.type as SectionType,
      },
    });
  } else if (data.type === SectionType.ABOVE_THE_FOLD_CONTENT) {
    await prisma.section.create({
      data: {
        name: data.name as string,
        isSubSection: data.isSubSection as boolean,
        feedContent: { connect: { id: data.feedContentId } },
        type: data.type as SectionType,
      },
    });
  } else if (data.type === SectionType.ECONOMIC_DATA) {
    await prisma.section.create({
      data: {
        name: data.name as string,
        isSubSection: data.isSubSection as boolean,
        localFeedContent: { connect: { id: data.localFeedContentId } },
        type: data.type as SectionType,
      },
    });
  } else if (data.type === SectionType.CHILD_SECTION) {
    await prisma.section.create({
      data: {
        name: data.name as string,
        isSubSection: data.isSubSection as boolean,
        parent: { connect: { id: data.parentId as string } },
        type: SectionType.CHILD_SECTION,
      },
    });
  }

  await prisma.$disconnect();
  return { success: true, message: "Section created successfully" };
};

/**
 * @description - This gets all sections
 * @route GET /content/section
 * @access Private
 * @returns a list of all sections
 */
const getSections = async () => {
  const sections = await prisma.section.findMany({
    select: {
      id: true,
      name: true,
      isSubSection: true,
      feedContent: {
        select: {
          id: true,
          name: true,
          logoIcon: true,
        },
      },
      author: true,
      summary: true,
      imageUrl: true,
      isLive: true,
      videoUrl: true,
      videoTitle: true,
      videoDescription: true,
      createdAt: true,
      updatedAt: true,
      feedContentId: true,
      localFeedContentId: true,
      parentId: true,
      type: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  await prisma.$disconnect();
  return sections;
};

/**
 * @description - This gets a section by id
 * @route GET /content/section/:id
 * @access Private
 * @param data
 * @returns the section
 */
const getSectionById = async (data: Pick<PartialSectionSchemaProps, "id">) => {
  const section = await prisma.section.findUnique({
    where: {
      id: data.id,
    },
    select: {
      id: true,
      name: true,
      title: true,
      content: true,
      imageUrl: true,
      author: true,
      summary: true,
      isSubSection: true,
      isLive: true,
      videoUrl: true,
      videoTitle: true,
      videoDescription: true,
      feedContentId: true,
      feedContent: {
        select: {
          id: true,
          name: true,
          logoIcon: true,
        },
      },
      localFeedContentId: true,
      parentId: true,
      type: true,
    },
  });
  await prisma.$disconnect();
  return section;
};

/**
 * @description - This gets a section by parent id
 * @route GET /content/section/:parentId
 * @access Private
 * @param data
 * @returns the section
 */
const getSectionByParentId = async (
  data: Pick<PartialSectionSchemaProps, "parentId">
) => {
  const section = await prisma.section.findMany({
    where: {
      parentId: data.parentId,
    },
    select: {
      id: true,
      name: true,
      title: true,
      content: true,
      imageUrl: true,
      author: true,
      summary: true,
      isSubSection: true,
      isLive: true,
      videoUrl: true,
      videoTitle: true,
      videoDescription: true,
      feedContentId: true,
      localFeedContentId: true,
      parentId: true,
      parent: {
        select: {
          id: true,
          name: true,
        },
      },
      type: true,
    },
  });
  await prisma.$disconnect();
  return section;
};

/**
 * @description - This gets a section by feed content id
 * @route GET /content/section/:feedContentId
 * @access Private
 * @param data
 * @returns the section
 */
const getSectionByFeedContentId = async (
  data: Pick<PartialSectionSchemaProps, "feedContentId">
) => {
  const section = await prisma.section.findMany({
    where: {
      feedContentId: data.feedContentId,
    },
    select: {
      id: true,
      name: true,
      title: true,
      content: true,
      imageUrl: true,
      author: true,
      summary: true,
      isSubSection: true,
      isLive: true,
      videoUrl: true,
      videoTitle: true,
      videoDescription: true,
      feedContentId: true,
      feedContent: {
        select: {
          id: true,
          name: true,
          logoIcon: true,
        },
      },
      localFeedContentId: true,
      parentId: true,
      type: true,
    },
  });
  await prisma.$disconnect();
  return section;
};

/**
 * @description - This gets a section by local feed content id
 * @route GET /content/section/:localFeedContentId
 * @access Private
 * @param data
 * @returns the section
 */
const getSectionByLocalFeedContentId = async (
  data: Pick<PartialSectionSchemaProps, "localFeedContentId">
) => {
  const section = await prisma.section.findMany({
    where: {
      localFeedContentId: data.localFeedContentId,
    },
    select: {
      id: true,
      name: true,
      title: true,
      content: true,
      imageUrl: true,
      author: true,
      summary: true,
      isSubSection: true,
      isLive: true,
      videoUrl: true,
      videoTitle: true,
      videoDescription: true,
      feedContentId: true,
      localFeedContentId: true,
      localFeedContent: {
        select: {
          id: true,
          name: true,
          logoIcon: true,
        },
      },
      parentId: true,
      type: true,
    },
  });
  await prisma.$disconnect();
  return section;
};

/**
 * @description - This updates a section
 * @route PUT /content/section/:id
 * @access Private
 * @param data
 * @returns the updated section
 */
const updateSectionById = async (data: PartialSectionSchemaProps) => {
  const section = await prisma.section.findUnique({
    where: {
      id: data.id,
    },
  });

  if (section) {
    await prisma.section.update({
      where: {
        id: data.id as string,
      },
      data: {
        title: data.title ? (data.title as string) : section.title,
        content: data.content ? (data.content as string) : section.content,
        imageUrl: data.imageUrl ? (data.imageUrl as string) : section.imageUrl,
        author: data.author ? (data.author as string) : section.author,
        summary: data.summary ? (data.summary as string) : section.summary,
        isSubSection:
          data?.isSubSection === true || data?.isSubSection === false
            ? (data.isSubSection as boolean)
            : section.isSubSection,
        isLive:
          data.isLive === true || data.isLive === false
            ? (data.isLive as boolean)
            : section.isLive,
        videoUrl: data.videoUrl ? (data.videoUrl as string) : section.videoUrl,
        videoTitle: data.videoTitle
          ? (data.videoTitle as string)
          : section.videoTitle,
        videoDescription: data.videoDescription
          ? (data.videoDescription as string)
          : section.videoDescription,
        name: data.name ? (data.name as string) : section.name,
        type: data.type ? (data.type as SectionType) : section.type,
      },
    });
  }

  await prisma.$disconnect();
  return { success: true, message: "Section updated successfully" };
};

/**
 * @description the function deletes a section
 * @route DELETE /content/section/:id
 * @access Private
 * @param data
 * @returns
 */
const deleteSection = async (data: Pick<PartialSectionSchemaProps, "id">) => {
  await prisma.section.delete({
    where: {
      id: data.id,
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Section deleted successfully" };
};

/**
 * @description the function deletes many sections
 * @route DELETE /content/delete-sections
 * @access Private
 * @returns an object with a success status and a message
 */
const deleteManySections = async (
  data: Pick<PartialSectionSchemaProps, "ids">
) => {
  await prisma.section.deleteMany({
    where: {
      id: {
        in: data.ids,
      },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Section deleted successfully" };
};

/**
 * @description - This creates a new widget under economic data
 * @route POST /content/economic-data
 * @access Private
 * @returns an object with a success status and a message
 */
const createEconomicDataWidget = async (
  data: PartialEconomicDataSchemaProps
) => {
  await prisma.economicDataWidget.create({
    data: {
      title: data.title as string,
      stats: data.stats as string,
      descriptionLine1: data.descriptionLine1 as string,
      descriptionLine2: data.descriptionLine2 as string,
      linkName: data.linkName as string,
      linkUrl: data.linkUrl as string,
      section: { connect: { id: data.sectionId as string } },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Economic Data saved successfully" };
};


/**
 * @description - This gets all economic data widgets
 * @route GET /content/economic-data
 * @access Private
 * @returns a list of all economic data widgets
 */
const getEconomicDataWidgets = async (
  data: Pick<PartialEconomicDataSchemaProps, "sectionId">
) => {
  const widgets = await prisma.economicDataWidget.findMany({
    where: {
      sectionId: data?.sectionId as string,
    },
  });
  await prisma.$disconnect();
  return widgets;
};

/**
 * @description - This gets a widget by id
 * @route GET /content/economic-data/:id
 * @access Private
 * @returns the requested widget
 */
const getEconomicDataWidgetById = async (
  data: Pick<PartialEconomicDataSchemaProps, "id">
) => {
  const economicDataWidget = await prisma.economicDataWidget.findUnique({
    where: {
      id: data.id,
    },
    select: {
      id: true,
      title: true,
      stats: true,
      descriptionLine1: true,
      descriptionLine2: true,
      linkName: true,
      linkUrl: true,
      sectionId: true,
    },
  });
  await prisma.$disconnect();
  return economicDataWidget;
};

/**
 * @description - This updates a widget
 * @route PUT /content/economic-data/:id
 * @access Private
 * @returns returns the updated widget
 */
const updateEconomicDataWidgetById = async (
  data: PartialEconomicDataSchemaProps
) => {
  const economicDataWidget = await prisma.economicDataWidget.findUnique({
    where: {
      id: data.id,
    },
  });
  if (economicDataWidget) {
    await prisma.economicDataWidget.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title ? (data.title as string) : economicDataWidget.title,
        stats: data.stats ? (data.stats as string) : economicDataWidget.stats,
        descriptionLine1: data.descriptionLine1
          ? (data.descriptionLine1 as string)
          : economicDataWidget.descriptionLine1,
        descriptionLine2: data.descriptionLine2
          ? (data.descriptionLine2 as string)
          : economicDataWidget.descriptionLine2,
        linkName: data.linkName
          ? (data.linkName as string)
          : economicDataWidget.linkName,
        linkUrl: data.linkUrl
          ? (data.linkUrl as string)
          : economicDataWidget.linkUrl,
      },
    });
  }
  await prisma.$disconnect();
  return { success: true, message: "Economic Data updated successfully" };
};

/**
 * @description - This deletes a widget
 * @route DELETE /content/economic-data/:id
 * @access Private
 * @returns  an object with a success status and a message
 */
const deleteEconomicDataWidgetById = async (
  data: Pick<PartialEconomicDataSchemaProps, "id">
) => {
  await prisma.economicDataWidget.delete({
    where: {
      id: data.id,
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Economic Data deleted successfully" };
};

/**
 * @description - This deletes many widget
 * @route DELETE /content/deleted-widgets
 * @access Private
 * @returns  an object with a success status and a message
 */
const deleteManyEconomicDataWidgets = async (
  data: Pick<PartialEconomicDataSchemaProps, "ids">
) => {
  await prisma.economicDataWidget.deleteMany({
    where: {
      id: {
        in: data.ids,
      },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Economic Data deleted successfully" };
};

/**
 * @description Create/Add Source Directory Data
 * @route POST /content/source-directory
 * @access Private
 * @param data
 */
const createSDData = async (data: PartialSourceDirectoryProps) => {
  if (data.type === SourceDirectoryType.BSI) {
    await prisma.businessSupportInformation.create({
      data: {
        category: data.category as string,
        description: data.description as string,
        webLink: data.webLink as string,
        canEmail: data.canEmail,
      },
    });
  } else if (data.type === SourceDirectoryType.IS) {
    await prisma.industrySector.create({
      data: {
        category: data.category as string,
        description: data.description as string,
        webLink: data.webLink as string,
        canEmail: data.canEmail,
      },
    });
  } else if (data.type === SourceDirectoryType.EU) {
    await prisma.economicUpdate.create({
      data: {
        category: data.category as string,
        description: data.description as string,
        webLink: data.webLink as string,
        canEmail: data.canEmail,
      },
    });
  }
  await prisma.$disconnect();
  return {
    success: true,
    message: "Source Directory Data created successfully",
  };
};

/**
 * @description Gets all source directory data
 * @route GET /content/source-directory
 * @access Private
 * @returns all source directory data
 */
const getAllSDData = async () => {};

/**
 * @description Gets all source directory data by type
 * @route GET /content/source-directory/:type
 * @access Private
 * @param type - type of source directory data
 * @returns all source directory data by type
 */
const getSDDataByType = async (type: SourceDirectoryType) => {
  let foundData;
  if (type === SourceDirectoryType.BSI) {
    foundData = await prisma.businessSupportInformation.findMany({
      where: {
        type: type,
      },
    });
  }
  if (type === SourceDirectoryType.IS) {
    foundData = await prisma.industrySector.findMany({
      where: {
        type: type,
      },
    });
  }
  if (type === SourceDirectoryType.EU) {
    foundData = await prisma.economicUpdate.findMany({
      where: {
        type: type,
      },
    });
  }
  await prisma.$disconnect();
  return foundData;
};

/**
 * @description PATCH source directory data
 * @route PATCH /content/source-directory/:type
 * @access Private
 */
const updateSDData = async (data: PartialSourceDirectoryProps) => {
  if (data.type === SourceDirectoryType.BSI) {
    await prisma.businessSupportInformation.update({
      where: {
        id: data.id,
      },
      data: {
        description: data.description,
        webLink: data.webLink,
        canEmail: data.canEmail,
        category: data.category,
      },
    });
  }
  if (data.type === SourceDirectoryType.IS) {
    await prisma.industrySector.update({
      where: {
        id: data.id,
      },
      data: {
        description: data.description,
        webLink: data.webLink,
        canEmail: data.canEmail,
        category: data.category,
      },
    });
  }
  if (data.type === SourceDirectoryType.EU) {
    await prisma.economicUpdate.update({
      where: {
        id: data.id,
      },
      data: {
        category: data.category,
        description: data.description,
        webLink: data.webLink,
        canEmail: data.canEmail,
      },
    });
  }
  await prisma.$disconnect();
  return { success: true, message: "Source Data updated successfully" };
};

/**
 * @description DELETE source directory data
 * @route DELETE /content/source-directory/:type
 * @access Private
 * @param data
 * @returns
 */
const deleteSDData = async (data: PartialSourceDirectoryProps) => {
  if (data.type === SourceDirectoryType.BSI) {
    await prisma.businessSupportInformation.delete({
      where: {
        id: data.id,
      },
    });
  }
  if (data.type === SourceDirectoryType.IS) {
    await prisma.industrySector.delete({
      where: {
        id: data.id,
      },
    });
  }
  if (data.type === SourceDirectoryType.EU) {
    await prisma.economicUpdate.delete({
      where: {
        id: data.id,
      },
    });
  }
  await prisma.$disconnect();
  return { success: true, message: "Source Data deleted successfully" };
};

/**
 * @description DELETE source directory data
 * @route DELETE /content/delete-source-directories/:type
 * @access Private
 * @param data
 */
const deleteManySDData = async (data: PartialSourceDirectoryProps) => {
  if (data.type === SourceDirectoryType.BSI) {
    await prisma.businessSupportInformation.deleteMany({
      where: {
        id: {
          in: data.ids,
        },
      },
    });
  }
  if (data.type === SourceDirectoryType.IS) {
    await prisma.industrySector.deleteMany({
      where: {
        id: {
          in: data.ids,
        },
      },
    });
  }
  if (data.type === SourceDirectoryType.EU) {
    await prisma.economicUpdate.deleteMany({
      where: {
        id: {
          in: data.ids,
        },
      },
    });
  }
  await prisma.$disconnect();
  return { success: true, message: "Source Data deleted successfully" };
};

/**
 * @description - This generates a PDF document of table data
 * @route POST /content/generate-pdf
 * @access Private
 * @param data
 * @returns the generated PDF document
 */

const generatePDF = async (data: { html: string; title: string }) => {
  const tableHtml = data.html as string;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(tableHtml);

  const pdfBuffer = await page.pdf({ format: "A4", landscape: true });

  await browser.close();

  await prisma.pdf.create({
    data: {
      title: data.title as string,
      content: pdfBuffer,
    },
  });

  return { success: true, message: "PDF generated successfully", pdfBuffer };
};

const contentService = {
  createFeedContent,
  getFeedContentById,
  getPublishedFeedContent,
  getFeedContent,
  updateFeedContent,
  removeFeedContent,
  removeManyFeedContent,
  addComment,
  createLocalFeed,
  getLocalFeed,
  getLocalFeedById,
  getLocalFeedByFeedContentId,
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
  getEconomicDataWidgets,
  createEconomicDataWidget,
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
  generatePDF,
};

export default contentService;
