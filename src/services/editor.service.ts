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
  const newDistrict = await prisma.district.create({
    data: {
      name: data.name as string,
      county: { connect: { id: data.countyId } },
    },
  });
  return newDistrict;
};

/**
 *
 * @param data
 * @returns
 */
const getDistrictById = async (data: Partial<DataProps>) => {
  const district = await prisma.district.findUnique({
    where: {
      id: data.id,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      whyInvest: true,
      economicData: {
        select: {
          id: true,
          economicDataWidgets: true,
        },
      },
      businessParks: true,
      councilServices: true,
      localNews: true,
      councilGrants: true,
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
const deleteDistrict = async (data: Partial<DataProps>) => {
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
        isLive: data.isLive ? (data.isLive as boolean) : section.isLive,
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
        isLive: data.isLive ? (data.isLive as boolean) : subsection.isLive,
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
        isLive: data.isLive ? (data.isLive as boolean) : subSubSection.isLive,
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
 *
 * @param data
 * @returns
 */
const updateOrCreateDistrictWhyInvestIn = async (data: Partial<DataProps>) => {
  const updatedOrCreatedDistrictWhyInvestIn = await prisma.whyInvest.upsert({
    where: {
      districtId: data.districtId,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
      imageUrl: data.imageUrl as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      imageUrl: data.imageUrl ? (data.imageUrl as string) : "",
      district: { connect: { id: data.districtId as string } },
    },
  });

  await prisma.$disconnect();
  return updatedOrCreatedDistrictWhyInvestIn;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateEconomicData = async (data: Partial<DataProps>) => {
  const updatedOrCreatedEconomicData = await prisma.economicData.upsert({
    where: {
      districtId: data.districtId,
    },
    update: {
      workingAgePopulation: Number(data?.workingAgePopulation) as number,
      labourDemand: Number(data.labourDemand) as number,
      noOfRetailShops: Number(data.noOfRetailShops) as number,
      unemploymentRate: Number(data.unemploymentRate) as number,
      employmentInvestmentLand: Number(data.employmentInvestmentLand) as number,
      numOfRegisteredCompanies: Number(data.numOfRegisteredCompanies) as number,
      numOfBusinessParks: Number(data.numOfBusinessParks) as number,
      averageHousingCost: Number(data.averageHousingCost) as number,
      averageWageEarnings: Number(data.averageWageEarnings) as number,
    },
    create: {
      workingAgePopulation: Number(data?.workingAgePopulation) as number,
      labourDemand: Number(data.labourDemand) as number,
      noOfRetailShops: Number(data.noOfRetailShops) as number,
      unemploymentRate: Number(data.unemploymentRate) as number,
      employmentInvestmentLand: Number(data.employmentInvestmentLand) as number,
      numOfRegisteredCompanies: Number(data.numOfRegisteredCompanies) as number,
      numOfBusinessParks: Number(data.numOfBusinessParks) as number,
      averageHousingCost: Number(data.averageHousingCost) as number,
      averageWageEarnings: Number(data.averageWageEarnings) as number,
      district: { connect: { id: data.districtId } },
    },
  });

  await prisma.$disconnect();
  return updatedOrCreatedEconomicData;
};

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
      economicData: { connect: { id: data.economicDataId as string } },
    },
  });
  await prisma.$disconnect();
  return { success: true }
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
      economicData: true,
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
const updateOrCreateDistrictBusinessParks = async (
  data: Partial<DataProps>
) => {
  const updatedOrCreatedDistrictBusinessParks =
    await prisma.businessPark.upsert({
      where: {
        districtId: data.districtId,
      },
      update: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl as string,
      },
      create: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl ? (data.imageUrl as string) : "",
        district: { connect: { id: data.districtId as string } },
      },
    });

  await prisma.$disconnect();
  return updatedOrCreatedDistrictBusinessParks;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateDistrictCouncilGrants = async (
  data: Partial<DataProps>
) => {
  const updatedOrCreatedDistrictCouncilGrants =
    await prisma.councilGrant.upsert({
      where: {
        districtId: data.districtId,
      },
      update: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl as string,
      },
      create: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl ? (data.imageUrl as string) : "",
        district: { connect: { id: data.districtId as string } },
      },
    });

  await prisma.$disconnect();
  return updatedOrCreatedDistrictCouncilGrants;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateDistrictCouncilServices = async (
  data: Partial<DataProps>
) => {
  const updatedOrCreatedDistrictCouncilServices =
    await prisma.councilService.upsert({
      where: {
        districtId: data.districtId,
      },
      update: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl as string,
      },
      create: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl ? (data.imageUrl as string) : "",
        district: { connect: { id: data.districtId as string } },
      },
    });

  await prisma.$disconnect();
  return updatedOrCreatedDistrictCouncilServices;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateDistrictLocalNews = async (data: Partial<DataProps>) => {
  const updatedOrCreatedDistrictLocalNews = await prisma.localNews.upsert({
    where: {
      districtId: data.districtId,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
      imageUrl: data.imageUrl as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      imageUrl: data.imageUrl ? (data.imageUrl as string) : "",
      district: { connect: { id: data.districtId as string } },
    },
  });

  await prisma.$disconnect();
  return updatedOrCreatedDistrictLocalNews;
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
  getDistrictById,
  updateDistrictById,
  deleteDistrict,
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
  createEconomicDataWidget,
  getEconomicDataWidgetById,
  updateEconomicDataWidgetById,
  deleteEconomicDataWidgetById,
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

export default editorService;
