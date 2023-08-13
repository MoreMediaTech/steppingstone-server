import createError from "http-errors";
import { PrismaClient, SourceDirectoryType } from "@prisma/client";
import { DataProps } from "../../../types";
import { SectionContentProps } from "../../schema/Section";

const prisma = new PrismaClient();

/**
 * @description - This function creates a new comment
 * @route POST /editor/comment
 * @access Private
 * @param data
 * @returns  a new comment
 */
const addComment = async (data: Partial<DataProps>) => {
  await prisma.comment.create({
    data: {
      comment: data.comment as string,
      author: { connect: { id: data.userId } },
      county: { connect: { id: data.id } },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Comment created successfully" };
};

const searchContent = async (query: string) => {};

/**
 * @description - This creates a new county
 * @route POST /editor/county
 * @access Private
 * @param data
 * @returns  a new county
 */
const addCounty = async (data: Partial<DataProps>) => {
  const existingCounty = await prisma.county.findUnique({
    where: {
      name: data.name,
    },
  });
  if (existingCounty) {
    throw createError(400, "County already exists");
  }
  await prisma.county.create({
    data: {
      name: data.name as string,
      author: { connect: { id: data.userId } },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "County created successfully" };
};

/**
 * @description - This function gets a county by id
 * @route GET /editor/county/:id
 * @access Private
 * @param data
 * @returns  returns a county by the provided id
 */
const getCountyById = async (data: Partial<DataProps>) => {
  const county = await prisma.county.findUnique({
    where: {
      id: data.id,
    },
    select: {
      id: true,
      name: true,
      authorId: true,
      published: true,
      viewCount: true,
      districts: {
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
      welcome: true,
      lep: true,
      news: true,
      imageUrl: true,
      logoIcon: true,
      sections: {
        select: {
          id: true,
          name: true,
          isSubSection: true,
          isLive: true,
        },
      },
    },
  });
  await prisma.$disconnect();
  return county;
};

/**
 * @description - This function gets all counties
 * @route GET /editor/county
 * @access Private
 * @returns a list of all counties
 */
const getCounties = async () => {
  const counties = await prisma.county.findMany({
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
  return counties;
};

/**
 * @description - This function gets all published counties
 * @route GET /editor/feed
 * @access Private
 * @returns a list of all counties
 */
const getPublishedCounties = async () => {
  const counties = await prisma.county.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      name: true,
      published: true,
      welcome: true,
      lep: true,
      news: true,
      districts: {
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
  return counties;
};

/**
 * @description - This updates a county
 * @route PUT /editor/county/:id
 * @access Private
 * @param data
 * @returns  an updated county data
 */
const updateCounty = async (data: Partial<DataProps>) => {
  const county = await prisma.county.findUnique({
    where: {
      id: data.id,
    },
  });

  if (county) {
    await prisma.county.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name ? (data.name as string) : county.name,
        imageUrl: data.imageUrl ? (data.imageUrl as string) : county.imageUrl,
        logoIcon: data.logoIcon ? (data.logoIcon as string) : county.logoIcon,
        published: data.published
          ? (data.published as boolean)
          : county.published,
      },
    });
  }
  await prisma.$disconnect();
  return { success: true, message: "County updated successfully" };
};

/**
 * @description - This function deletes a county by Id
 * @route DELETE /editor/county/:id
 * @access Private
 * @param data
 */
const removeCounty = async (data: Partial<DataProps>) => {
  await prisma.county.delete({
    where: {
      id: data.id,
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "County deleted successfully" };
};

/**
 * @description - This function deletes may counties
 * @route DELETE /editor/delete-counties
 * @access Private
 * @param data - ids - an array of ids
 */
const removeManyCounties = async (data: Partial<DataProps>) => {
  await prisma.county.deleteMany({
    where: {
      id: {
        in: data.ids,
      },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "County deleted successfully" };
};

/**
 * @description - This creates a new district
 * @route POST /editor/district
 * @access Private
 * @param data
 * @returns   a new district
 */
const addDistrict = async (data: Partial<DataProps>) => {
  const existingDistrict = await prisma.district.findUnique({
    where: {
      name: data.name,
    },
  });
  if (existingDistrict) {
    throw createError(400, "District already exists");
  }
  await prisma.district.create({
    data: {
      name: data.name as string,
      county: { connect: { id: data.countyId } },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "District created successfully" };
};

/**
 * @description - This gets all districts
 * @route GET /editor/district
 * @access Private
 * @returns a list of all districts
 */
const getDistricts = async () => {
  const districts = await prisma.district.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      logoIcon: true,
      districtSections: true,
      isLive: true,
      county: {
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
  return districts;
};

/**
 * @description - This gets a district by id
 * @route GET /editor/district/:id
 * @access Private
 * @param data
 * @returns
 */
const getDistrictById = async (data: Partial<DataProps>) => {
  const district = await prisma.district.findUnique({
    where: {
      id: data.id as string,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      logoIcon: true,
      isLive: true,
      districtSections: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  await prisma.$disconnect();
  return district;
};

/**
 * @description - This updates a district by id
 * @route PUT /editor/district/:id
 * @access Private
 * @param data
 * @returns
 */
const updateDistrictById = async (data: Partial<DataProps>) => {
  const district = await prisma.district.findUnique({
    where: {
      id: data.id,
    },
  });

  if (district) {
    await prisma.district.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name ? (data.name as string) : district.name,
        imageUrl: data.imageUrl ? (data.imageUrl as string) : district.imageUrl,
        logoIcon: data.logoIcon ? (data.imageUrl as string) : district.logoIcon,
        isLive: data.isLive ? (data.isLive as boolean) : district.isLive,
      },
    });
  }
  await prisma.$disconnect();
  return { success: true, message: "District updated successfully" };
};

/**
 * @description - This deletes a district by id
 * @route DELETE /editor/district/:id
 * @access Private
 * @param data
 * @returns
 */
const deleteDistrictById = async (data: Partial<DataProps>) => {
  await prisma.district.delete({
    where: {
      id: data.id,
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "District deleted successfully" };
};

/**
 * @description - This deletes many districts
 * @route DELETE /editor/delete-districts
 * @access Private
 * @param data
 * @returns
 */
const deleteManyDistricts = async (data: Partial<DataProps>) => {
  await prisma.district.deleteMany({
    where: {
      id: {
        in: data.ids,
      },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "District deleted successfully" };
};

/**
 * @description - This creates a new section under a county
 * @route POST /editor/section
 * @access Private
 * @param data
 * @returns the newly created section
 */
const createSection = async (data: Partial<DataProps>) => {
  const existingSection = await prisma.section.findUnique({
    where: {
      name: data.name,
    },
  });
  if (existingSection) {
    throw createError(400, "Section already exists");
  }
  await prisma.section.create({
    data: {
      name: data.name as string,
      isSubSection: data.isSubSection as boolean,
      county: { connect: { id: data.countyId } },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Section created successfully" };
};

/**
 * @description - This gets all sections
 * @route GET /editor/section
 * @access Private
 * @returns a list of all sections
 */
const getSections = async () => {
  const sections = await prisma.section.findMany({
    select: {
      id: true,
      name: true,
      isSubSection: true,
      county: true,
      author: true,
      summary: true,
      imageUrl: true,
      subsections: true,
      isLive: true,
      videoUrl: true,
      videoTitle: true,
      videoDescription: true,
      createdAt: true,
      updatedAt: true,
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
 * @route GET /editor/section/:id
 * @access Private
 * @param data
 * @returns the section
 */
const getSectionById = async (data: Pick<SectionContentProps, "id">) => {
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
      subsections: true,
      countyId: true,
    },
  });
  await prisma.$disconnect();
  return section;
};

/**
 * @description - This updates a section
 * @route PUT /editor/section/:id
 * @access Private
 * @param data
 * @returns the updated section
 */
const updateSectionById = async (data: SectionContentProps) => {
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
      },
    });
  }

  await prisma.$disconnect();
  return { success: true, message: "Section updated successfully" };
};

/**
 * @description the function deletes a section
 * @route DELETE /editor/section/:id
 * @access Private
 * @param data
 * @returns
 */
const deleteSection = async (data: Partial<DataProps>) => {
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
 * @route DELETE /editor/delete-sections
 * @access Private
 * @param data
 * @returns
 */
const deleteManySections = async (data: Partial<DataProps>) => {
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
 * @description - This creates a new subsection under a section
 * @route POST /editor/subsection
 * @access Private
 * @param data
 * @returns
 */
const createSubsection = async (data: Partial<DataProps>) => {
  const subsection = await prisma.subSection.create({
    data: {
      name: data.name as string,
      isSubSubSection: data.isSubSection as boolean,
      section: { connect: { id: data.sectionId } },
    },
  });
  await prisma.$disconnect();
  return subsection;
};

/**
 * @description - This gets a subsection by id
 * @route GET /editor/subsection/:id
 * @access Private
 * @param data
 * @returns
 */
const getSubsectionById = async (data: Pick<SectionContentProps, "id">) => {
  const subsection = await prisma.subSection.findUnique({
    where: {
      id: data.id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      name: true,
      author: true,
      summary: true,
      imageUrl: true,
      isLive: true,
      videoUrl: true,
      videoTitle: true,
      videoDescription: true,
      isSubSubSection: true,
      subSubSections: true,
    },
  });
  await prisma.$disconnect();
  return subsection;
};

// TODO: Look into route of this function
/**
 * @description - This gets the subsections of a section if isSubSection is true
 * @route GET /editor/subsection/:id
 * @access Private
 * @param data
 * @returns
 */
const getSubSectionsBySectionId = async (
  data: Pick<SectionContentProps, "id">
) => {
  const subsections = await prisma.subSection.findMany({
    where: {
      sectionId: data.id,
    },
    select: {
      id: true,
      name: true,
      title: true,
      content: true,
      author: true,
      summary: true,
      imageUrl: true,
      isLive: true,
      videoUrl: true,
      videoTitle: true,
      videoDescription: true,
      isSubSubSection: true,
      subSubSections: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  await prisma.$disconnect();
  return subsections;
};

/**
 * @description - This updates a subsection
 * @route PUT /editor/subsection
 * @access Private
 * @param data
 * @returns
 */
const updateSubsectionById = async (data: SectionContentProps) => {
  const subsection = await prisma.subSection.findUnique({
    where: {
      id: data.id,
    },
  });

  if (subsection) {
    await prisma.subSection.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title ? (data.title as string) : subsection.title,
        content: data.content ? (data.content as string) : subsection.content,
        imageUrl: data.imageUrl
          ? (data.imageUrl as string)
          : subsection.imageUrl,
        author: data.author ? (data.author as string) : subsection.author,
        summary: data.summary ? (data.summary as string) : subsection.summary,
        isSubSubSection:
          data?.isSubSubSection === true || data?.isSubSubSection === false
            ? (data.isSubSubSection as boolean)
            : subsection.isSubSubSection,
        isLive:
          data.isLive === true || data.isLive === false
            ? (data.isLive as boolean)
            : subsection.isLive,
        videoUrl: data.videoUrl
          ? (data.videoUrl as string)
          : subsection.videoUrl,
        videoTitle: data.videoTitle
          ? (data.videoTitle as string)
          : subsection.videoTitle,
        videoDescription: data.videoDescription
          ? (data.videoDescription as string)
          : subsection.videoDescription,
        name: data.name ? (data.name as string) : subsection.name,
      },
    });
  }
  await prisma.$disconnect();
  return { success: true, message: "Subsection updated successfully" };
};

/**
 * @description - This deletes a subsection by Id
 * @route DELETE /editor/subsection/:id
 * @access Private
 * @param data
 * @returns
 */
const deleteSubsection = async (data: Partial<DataProps>) => {
  await prisma.subSection.delete({
    where: {
      id: data.id,
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Subsection deleted successfully" };
};

/**
 * @description - This deletes many subsections
 * @route DELETE /editor/delete-subsections
 * @access Private
 * @param data - array of ids
 * @returns
 */
const deleteManySubsections = async (data: Partial<DataProps>) => {
  await prisma.subSection.deleteMany({
    where: {
      id: {
        in: data.ids,
      },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Subsection deleted successfully" };
};

/**
 * @description - This creates a new subsection under a subsection
 * @route POST /editor/sub-subsection
 * @access Private
 * @param data
 * @returns
 */
const createSubSubSection = async (data: Partial<DataProps>) => {
  await prisma.subSubSection.create({
    data: {
      name: data.name as string,
      subSection: { connect: { id: data.subSectionId } },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Sub SubSection created successfully" };
};

/**
 * @description - This gets a subsection by id
 * @route GET /editor/sub-subsection/:id
 * @access Private
 * @param data
 * @returns
 */
const getSubSubSectionById = async (data: Pick<SectionContentProps, "id">) => {
  const subSubSection = await prisma.subSubSection.findUnique({
    where: {
      id: data.id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      imageUrl: true,
      author: true,
      summary: true,
      name: true,
      isLive: true,
    },
  });
  await prisma.$disconnect();
  return subSubSection;
};

/**
 * @description - This updates a subsection
 * @route PUT /editor/sub-subsection
 * @access Private
 * @param data
 * @returns
 */
const updateSubSubSectionById = async (data: SectionContentProps) => {
  const subSubSection = await prisma.subSubSection.findUnique({
    where: {
      id: data.id,
    },
  });

  if (subSubSection) {
    await prisma.subSubSection.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title ? (data.title as string) : subSubSection.title,
        content: data.content
          ? (data.content as string)
          : subSubSection.content,
        imageUrl: data.imageUrl
          ? (data.imageUrl as string)
          : subSubSection.imageUrl,
        author: data.author ? (data.author as string) : subSubSection.author,
        summary: data.summary
          ? (data.summary as string)
          : subSubSection.summary,
        isLive:
          data.isLive === true || data.isLive === false
            ? (data.isLive as boolean)
            : subSubSection.isLive,
        videoUrl: data.videoUrl
          ? (data.videoUrl as string)
          : subSubSection.videoUrl,
        videoTitle: data.videoTitle
          ? (data.videoTitle as string)
          : subSubSection.videoTitle,
        videoDescription: data.videoDescription
          ? (data.videoDescription as string)
          : subSubSection.videoDescription,
        name: data.name ? (data.name as string) : subSubSection.name,
      },
    });
  }
  await prisma.$disconnect();
  return { success: true, message: "Sub SubSection updated successfully" };
};

/**
 * @description - This deletes a subsection by Id
 * @route DELETE /editor/sub-subsection/:id
 * @access Private
 * @param data
 * @returns
 */
const deleteSubSubSectionById = async (
  data: Pick<SectionContentProps, "id">
) => {
  await prisma.subSubSection.delete({
    where: {
      id: data.id,
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Sub SubSection deleted successfully" };
};

/**
 * @description - This deletes many subsections
 * @route DELETE /editor/delete-sub-subsections
 * @access Private
 * @param data - array of ids
 * @returns
 */
const deleteManySubSubSections = async (
  data: Pick<SectionContentProps, "id" | "ids">
) => {
  await prisma.subSubSection.deleteMany({
    where: {
      id: {
        in: data.ids as string[],
      },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Sub SubSection deleted successfully" };
};

/**
 * @description - This creates a new district section under a district
 * @route POST /editor/district-section
 * @access Private
 * @param data
 * @returns the newly created section
 */
const createDistrictSection = async (data: Partial<DataProps>) => {
  await prisma.districtSection.create({
    data: {
      name: data.name as string,
      district: { connect: { id: data.districtId } },
      isEconomicData: data.isEconomicData as boolean,
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "District Section created successfully" };
};

/**
 * @description - This gets a district section by id
 * @route GET /editor/district-section/:id
 * @access Private
 * @param data
 * @returns the section
 */
const getDistrictSectionById = async (
  data: Pick<SectionContentProps, "id">
) => {
  const section = await prisma.districtSection.findUnique({
    where: {
      id: data.id,
    },
    select: {
      id: true,
      name: true,
      title: true,
      imageUrl: true,
      content: true,
      author: true,
      summary: true,
      isEconomicData: true,
      isLive: true,
      economicDataWidgets: true,
    },
  });
  await prisma.$disconnect();
  return section;
};

/**
 * @description - This finds district sections by a district id
 * @route GET /editor/district-sections/:id
 * @access Private
 * @param data
 * @returns  an array of sections
 */
const getDistrictSectionsByDistrictId = async (
  data: Pick<SectionContentProps, "id">
) => {
  const sections = await prisma.districtSection.findMany({
    where: {
      districtId: data?.id,
    },
    select: {
      id: true,
      name: true,
      title: true,
      imageUrl: true,
      content: true,
      author: true,
      summary: true,
      isEconomicData: true,
      isLive: true,
      economicDataWidgets: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  await prisma.$disconnect();
  return sections;
};

/**
 * @description - This updates a district section
 * @route PUT /editor/district-section
 * @access Private
 * @param data
 * @returns the updated section
 */
const updateDistrictSectionById = async (data: SectionContentProps) => {
  const section = await prisma.districtSection.findUnique({
    where: {
      id: data.id,
    },
  });

  if (section) {
    await prisma.districtSection.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title ? (data.title as string) : section.title,
        imageUrl: data.imageUrl ? (data.imageUrl as string) : section.imageUrl,
        author: data.author ? (data.author as string) : section.author,
        summary: data.summary ? (data.summary as string) : section.summary,
        content: data.content ? (data.content as string) : section.content,
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
      },
    });
  }
  await prisma.$disconnect();
  return { success: true, message: "District Section updated successfully" };
};

/**
 * @description the function deletes a district section
 * @route DELETE /editor/district-section/:id
 * @access Private
 * @param data
 * @returns
 */
const deleteDistrictSection = async (data: Pick<SectionContentProps, "id">) => {
  await prisma.districtSection.delete({
    where: {
      id: data.id,
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "District Section deleted successfully" };
};

/**
 * @description the function deletes many district sections
 * @route DELETE /editor/delete-district-sections
 * @access Private
 * @param data
 * @returns
 */
const deleteManyDistrictSections = async (
  data: Pick<SectionContentProps, "id" | "ids">
) => {
  await prisma.districtSection.deleteMany({
    where: {
      id: {
        in: data.ids as string[],
      },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "District Section deleted successfully" };
};

/**
 * @description - This creates a new widget under economic data
 * @route POST /editor/economic-data
 * @access Private
 * @param data
 * @returns returns a boolean if the widget was created or not
 */
const createEconomicDataWidget = async (data: Partial<DataProps>) => {
  await prisma.economicDataWidget.create({
    data: {
      title: data.title as string,
      stats: data.stats as string,
      descriptionLine1: data.descriptionLine1 as string,
      descriptionLine2: data.descriptionLine2 as string,
      linkName: data.linkName as string,
      linkUrl: data.linkUrl as string,
      districtSection: { connect: { id: data.districtSectionId as string } },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Economic Data saved successfully" };
};

/**
 * @description - This gets a widget by id
 * @route GET /editor/economic-data/:id
 * @param data
 * @returns the requested widget
 */
const getEconomicDataWidgetById = async (data: Partial<DataProps>) => {
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
      districtSection: true,
    },
  });
  await prisma.$disconnect();
  return economicDataWidget;
};

/**
 * @description - This updates a widget
 * @route PUT /editor/economic-data/:id
 * @access Private
 * @param data
 * @returns returns the updated widget
 */
const updateEconomicDataWidgetById = async (data: Partial<DataProps>) => {
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
 * @route DELETE /editor/economic-data/:id
 * @access Private
 * @param data
 * @returns  a boolean confirming the deletion
 */
const deleteEconomicDataWidgetById = async (data: Partial<DataProps>) => {
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
 * @route DELETE /editor/delete-ed-widgets
 * @access Private
 * @param data the ids of the widgets to be deleted
 * @returns  a boolean confirming the deletion
 */
const deleteManyEconomicDataWidgets = async (data: Partial<DataProps>) => {
  await prisma.economicDataWidget.delete({
    where: {
      id: data.id,
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Economic Data deleted successfully" };
};

/**
 * @description - This creates (if welcome data does not exist) or updates the welcome section under each county
 * @route POST /editor/county-welcome
 * @access Private
 * @param data
 * @returns
 */
const updateOrCreateCountyWelcome = async (data: SectionContentProps) => {
  await prisma.welcome.upsert({
    where: {
      countyId: data.countyId,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
      isLive: data.isLive as boolean,
      imageUrl: data.imageUrl as string,
      author: data.author as string,
      summary: data.summary as string,
      videoUrl: data.videoUrl as string,
      videoTitle: data.videoTitle as string,
      videoDescription: data.videoDescription as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      county: { connect: { id: data.countyId as string } },
      imageUrl: data.imageUrl as string,
      author: data.author as string,
      summary: data.summary as string,
      videoUrl: data.videoUrl as string,
      videoTitle: data.videoTitle as string,
      videoDescription: data.videoDescription as string,
    },
  });
  return { success: true, message: "Welcome updated successfully" };
};

/**
 * @description - This creates (if News data does not exist) or updates the News section under each county
 * @route POST /editor/county-news
 * @access Private
 * @param data
 * @returns
 */
const updateOrCreateCountyNews = async (data: SectionContentProps) => {
  await prisma.news.upsert({
    where: {
      countyId: data.countyId,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
      isLive: data.isLive as boolean,
      imageUrl: data.imageUrl as string,
      author: data.author as string,
      summary: data.summary as string,
      videoUrl: data.videoUrl as string,
      videoTitle: data.videoTitle as string,
      videoDescription: data.videoDescription as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      county: { connect: { id: data.countyId as string } },
      imageUrl: data.imageUrl as string,
      author: data.author as string,
      summary: data.summary as string,
      videoUrl: data.videoUrl as string,
      videoTitle: data.videoTitle as string,
      videoDescription: data.videoDescription as string,
    },
  });
  return { success: true, message: "News updated successfully" };
};

/**
 * @description - This creates (if LEP does not exist) or updates the LEP section under each county
 * @route POST /editor/county-lep
 * @access Private
 * @param data
 * @returns
 */
const updateOrCreateCountyLEP = async (data: SectionContentProps) => {
  await prisma.lEP.upsert({
    where: {
      countyId: data.countyId,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
      isLive: data.isLive as boolean,
      imageUrl: data.imageUrl as string,
      author: data.author as string,
      summary: data.summary as string,
      videoUrl: data.videoUrl as string,
      videoTitle: data.videoTitle as string,
      videoDescription: data.videoDescription as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      county: { connect: { id: data.countyId as string } },
      imageUrl: data.imageUrl as string,
      author: data.author as string,
      summary: data.summary as string,
    },
  });
  return { success: true, message: "LEP updated successfully" };
};

/**
 * @description Create/Add Source Directory Data
 * @route POST /editor/source-directory
 * @access Private
 * @param data
 */
const createSDData = async (data: Partial<DataProps>) => {
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
 * @route GET /editor/source-directory
 * @access Private
 * @returns all source directory data
 */
const getAllSDData = async () => {};

/**
 * @description Gets all source directory data by type
 * @route GET /editor/source-directory/:type
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
 * @route PATCH /editor/source-directory/:type
 * @access Private
 */
const updateSDData = async (data: Partial<DataProps>) => {
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
 * @route DELETE /editor/source-directory/:type
 * @access Private
 * @param data
 * @returns
 */
const deleteSDData = async (data: Partial<DataProps>) => {
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
 * @route DELETE /editor/delete-source-directories/:type
 * @access Private
 * @param data
 */
const deleteManySDData = async (data: Partial<DataProps>) => {
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

const editorService = {
  addCounty,
  getCounties,
  getPublishedCounties,
  getCountyById,
  updateCounty,
  removeCounty,
  removeManyCounties,
  addComment,
  addDistrict,
  getDistricts,
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
  createSubSubSection,
  getSubSubSectionById,
  updateSubSubSectionById,
  deleteSubSubSectionById,
  deleteManySubSubSections,
  createDistrictSection,
  getDistrictSectionById,
  updateDistrictSectionById,
  deleteDistrictSection,
  deleteManyDistrictSections,
  createEconomicDataWidget,
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
};

export default editorService;
