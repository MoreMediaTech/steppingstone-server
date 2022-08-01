import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { DataProps } from "../../types";

const prisma = new PrismaClient();

/**
 * @description - This function creates a new comment
 * @param data
 * @returns  a new comment
 */
const addComment = async (data: Partial<DataProps>) => {
  const newComment = await prisma.comment.create({
    data: {
      comment: data.comment as string,
      author: { connect: { id: data.userId } },
      county: { connect: { id: data.id } },
    },
  });
  return newComment;
};

/**
 * @description - This function gets a county by id
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
  return county;
};

/**
 * @description - This creates a new county
 * @param data
 * @returns  a new county
 */
const addCounty = async (data: Partial<DataProps>) => {
  try {
    const existingCounty = await prisma.county.findUnique({
      where: {
        name: data.name,
      },
    });
    if (existingCounty) {
      throw createError(400, "County already exists");
    }
    const newCounty = await prisma.county.create({
      data: {
        name: data.name as string,
        author: { connect: { id: data.userId } },
      },
    });
    return newCounty;
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

/**
 * @description - This function gets all counties
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
  return counties;
};

/**
 * @description - This function gets all published counties
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
      viewCount: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return counties;
};

/**
 * @description - This updates a county
 * @param data
 * @returns  an updated county data
 */
const updateCounty = async (data: Partial<DataProps>) => {
  const county = await prisma.county.findUnique({
    where: {
      id: data.id,
    },
  });
  let updatedCounty;
  if (county) {
    updatedCounty = await prisma.county.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name ? (data.name as string) : county.name,
        imageUrl: data.imageUrl ? (data.imageUrl as string) : county.imageUrl,
        logoIcon: data.logoIcon ? (data.imageUrl as string) : county.logoIcon,
        published: data.published
          ? (data.published as boolean)
          : county.published,
      },
    });
  }
  return updatedCounty;
};

/**
 *
 * @param data
 */
const removeCounty = async (data: Partial<DataProps>) => {
  await prisma.county.delete({
    where: {
      id: data.id,
    },
  });
  await prisma.$disconnect();
  return { success: true };
};

/**
 * @description - This creates a new district
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
  const newDistrict = await prisma.district.create({
    data: {
      name: data.name as string,
      county: { connect: { id: data.countyId } },
    },
  });
  return newDistrict;
};

/**
 * @description - This gets all districts
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
  return districts;
};

/**
 *
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
 *
 * @param data
 * @returns
 */
const updateDistrictById = async (data: Partial<DataProps>) => {
  const district = await prisma.district.findUnique({
    where: {
      id: data.id,
    },
  });
  let updatedDistrict;
  if (district) {
    updatedDistrict = await prisma.district.update({
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
  return updatedDistrict;
};

/**
 *
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
  return { success: true };
};

/**
 * @description - This creates a new section under a county
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
  const section = await prisma.section.create({
    data: {
      name: data.name as string,
      isSubSection: data.isSubSection as boolean,
      county: { connect: { id: data.countyId } },
    },
  });
  return section;
};

/**
 * @description - This gets all sections
 * @returns a list of all sections
 */
const getSections = async () => {
  const sections = await prisma.section.findMany({
    select: {
      id: true,
      name: true,
      isSubSection: true,
      county: true,
      subsections: true,
      isLive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return sections;
};

/**
 * @description - This gets a section by id
 * @param data
 * @returns the section
 */
const getSectionById = async (data: Partial<DataProps>) => {
  const section = await prisma.section.findUnique({
    where: {
      id: data.id,
    },
    select: {
      id: true,
      name: true,
      title: true,
      content: true,
      isSubSection: true,
      isLive: true,
      subsections: true,
    },
  });
  await prisma.$disconnect();
  return section;
};

/**
 * @description - This updates a section
 * @param data
 * @returns the updated section
 */
const updateSectionById = async (data: Partial<DataProps>) => {
  const section = await prisma.section.findUnique({
    where: {
      id: data.id,
    },
  });
  let updatedSection;
  if (section) {
    updatedSection = await prisma.section.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title ? (data.title as string) : section.title,
        content: data.content ? (data.content as string) : section.content,
        isSubSection:
          data?.isSubSection === true || data?.isSubSection === false
            ? (data.isSubSection as boolean)
            : section.isSubSection,
        isLive:
          data.isLive === true || data.isLive === false
            ? (data.isLive as boolean)
            : section.isLive,
      },
    });
  }

  await prisma.$disconnect();
  return updatedSection;
};

/**
 * @description the function deletes a section
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
  return { success: true };
};

/**
 * @description - This creates a new subsection under a section
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
  return subsection;
};

/**
 * @description - This gets a subsection by id
 * @param data
 * @returns
 */
const getSubsectionById = async (data: Partial<DataProps>) => {
  const subsection = await prisma.subSection.findUnique({
    where: {
      id: data.id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      name: true,
      isLive: true,
      isSubSubSection: true,
      subSubSections: true,
    },
  });
  await prisma.$disconnect();
  return subsection;
};

/**
 * @description - This updates a subsection
 * @param data
 * @returns
 */
const updateSubsectionById = async (data: Partial<DataProps>) => {
  const subsection = await prisma.subSection.findUnique({
    where: {
      id: data.id,
    },
  });
  let updatedSubsection;
  if (subsection) {
    updatedSubsection = await prisma.subSection.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title ? (data.title as string) : subsection.title,
        content: data.content ? (data.content as string) : subsection.content,
        isSubSubSection:
          data?.isSubSubSection === true || data?.isSubSubSection === false
            ? (data.isSubSubSection as boolean)
            : subsection.isSubSubSection,
        isLive:
          data.isLive === true || data.isLive === false
            ? (data.isLive as boolean)
            : subsection.isLive,
      },
    });
  }
  await prisma.$disconnect();
  return updatedSubsection;
};

/**
 * @description - This deletes a subsection
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
  return { success: true };
};

/**
 * @description - This creates a new subsection under a subsection
 * @param data
 * @returns
 */
const createSubSubSection = async (data: Partial<DataProps>) => {
  const subSubSection = await prisma.subSubSection.create({
    data: {
      name: data.name as string,
      subSection: { connect: { id: data.subSectionId } },
    },
  });
  return subSubSection;
};

/**
 * @description - This gets a subsection by id
 * @param data
 * @returns
 */
const getSubSubSectionById = async (data: Partial<DataProps>) => {
  const subSubSection = await prisma.subSubSection.findUnique({
    where: {
      id: data.id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      name: true,
      isLive: true,
    },
  });
  await prisma.$disconnect();
  return subSubSection;
};

/**
 * @description - This updates a subsection
 * @param data
 * @returns
 */
const updateSubSubSectionById = async (data: Partial<DataProps>) => {
  const subSubSection = await prisma.subSubSection.findUnique({
    where: {
      id: data.id,
    },
  });
  let updatedSubSubSection;
  if (subSubSection) {
    updatedSubSubSection = await prisma.subSubSection.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title ? (data.title as string) : subSubSection.title,
        content: data.content
          ? (data.content as string)
          : subSubSection.content,
        isLive:
          data.isLive === true || data.isLive === false
            ? (data.isLive as boolean)
            : subSubSection.isLive,
      },
    });
  }
  await prisma.$disconnect();
  return updatedSubSubSection;
};

/**
 * @description - This deletes a subsection
 * @param data
 * @returns
 */
const deleteSubSubSectionById = async (data: Partial<DataProps>) => {
  await prisma.subSubSection.delete({
    where: {
      id: data.id,
    },
  });
  await prisma.$disconnect();
  return { success: true };
};

/**
 * @description - This creates a new section under a county
 * @param data
 * @returns the newly created section
 */
const createDistrictSection = async (data: Partial<DataProps>) => {
  const section = await prisma.districtSection.create({
    data: {
      name: data.name as string,
      district: { connect: { id: data.districtId } },
      isEconomicData: data.isEconomicData as boolean,
    },
  });
  return section;
};

/**
 * @description - This gets a section by id
 * @param data
 * @returns the section
 */
const getDistrictSectionById = async (data: Partial<DataProps>) => {
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
 * @param data
 * @returns  an array of sections
 */
const getDistrictSectionsByDistrictId = async (data: Partial<DataProps>) => {
  const sections = await prisma.districtSection.findMany({
    where: {
      districtId: data?.districtId,
    },
    select: {
      id: true,
      name: true,
      title: true,
      imageUrl: true,
      content: true,
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
 * @description - This updates a section
 * @param data
 * @returns the updated section
 */
const updateDistrictSectionById = async (data: Partial<DataProps>) => {
  const section = await prisma.districtSection.findUnique({
    where: {
      id: data.id,
    },
  });
  let updatedSection;
  if (section) {
    updatedSection = await prisma.districtSection.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title ? (data.title as string) : section.title,
        imageUrl: data.imageUrl ? (data.imageUrl as string) : section.imageUrl,
        content: data.content ? (data.content as string) : section.content,
        isLive:
          data.isLive === true || data.isLive === false
            ? (data.isLive as boolean)
            : section.isLive,
      },
    });
  }
  await prisma.$disconnect();
  return updatedSection;
};

/**
 * @description the function deletes a section
 * @param data
 * @returns
 */
const deleteDistrictSection = async (data: Partial<DataProps>) => {
  await prisma.districtSection.delete({
    where: {
      id: data.id,
    },
  });
  await prisma.$disconnect();
  return { success: true };
};


/**
 *
 * @param data
 * @returns
 */

/**
 * @description - This creates a new widget under economic data
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
  return { success: true };
};

/**
 * @description - This gets a widget by id
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
  return { success: true };
};

/**
 * @description - This deletes a widget
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
  return { success: true };
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateCountyWelcome = async (data: Partial<DataProps>) => {
  const updatedCountyWelcome = await prisma.welcome.upsert({
    where: {
      countyId: data.countyId,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      county: { connect: { id: data.countyId as string } },
    },
  });
  return updatedCountyWelcome;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateCountyNews = async (data: Partial<DataProps>) => {
  const updatedCountyNews = await prisma.news.upsert({
    where: {
      countyId: data.countyId,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      county: { connect: { id: data.countyId as string } },
    },
  });
  return updatedCountyNews;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateCountyLEP = async (data: Partial<DataProps>) => {
  const updatedCountyLEP = await prisma.lEP.upsert({
    where: {
      countyId: data.countyId,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      county: { connect: { id: data.countyId as string } },
    },
  });
  return updatedCountyLEP;
};

const editorService = {
  addCounty,
  getCounties,
  getPublishedCounties,
  getCountyById,
  updateCounty,
  removeCounty,
  addComment,
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
  updateSubsectionById,
  deleteSubsection,
  createSubSubSection,
  getSubSubSectionById,
  updateSubSubSectionById,
  deleteSubSubSectionById,
  createDistrictSection,
  getDistrictSectionById,
  updateDistrictSectionById,
  deleteDistrictSection,
  createEconomicDataWidget,
  getEconomicDataWidgetById,
  updateEconomicDataWidgetById,
  deleteEconomicDataWidgetById,
  updateOrCreateCountyWelcome,
  updateOrCreateCountyNews,
  updateOrCreateCountyLEP,
  getDistrictSectionsByDistrictId,
};

export default editorService;
