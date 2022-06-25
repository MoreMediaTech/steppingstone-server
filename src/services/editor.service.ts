import createError from "http-errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DataProps = {
  id: string;
  name: string;
  userId: string;
  comment: string;
  countyId: string;
  imageUrl: string;
  logoIcon: string;
  title: string;
  content: string;
  districtId: string;
  whyInvest: {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
  };
  workingAgePopulation: number;
  labourDemand: number;
  noOfRetailShops: number;
  unemploymentRate: number;
  employmentInvestmentLand: number;
  numOfRegisteredCompanies: number;
  numOfBusinessParks: number;
  averageHousingCost: number;
  averageWageEarnings: number;
  supportForStartupId: string;
};

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
      featureArticle: true,
      supportForStartups: true,
      topicalBusinessIssues: {
        select: {
          id: true,
          onlineDigitilisation: true,
        },
      },
      businessNewsAndInformation: true,
      supportForEstablishedBusiness: true,
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
  const deletedCounty = await prisma.county.delete({
    where: {
      id: data.id,
    },
  });
  await prisma.$disconnect();
  return { sucess: true };
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
  const deletedDistrict = await prisma.district.delete({
    where: {
      id: data.id,
    }
  });
  await prisma.$disconnect();
  return { sucess: true };
};

/**
 * 
 * @param data 
 * @returns 
 */
const updateOrCreateDistrictWhyInvestIn = async (data: Partial<DataProps>) => {
  const updatedOrCreatedDistrictWhyInvestIn = await prisma.whyInvest.upsert({
    where: {
      id: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
      imageUrl: data.imageUrl as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      imageUrl: data.imageUrl as string,
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
      id: data.id,
    },
    update: {
      workingAgePopulation: data?.workingAgePopulation as number,
      labourDemand: data.labourDemand as number,
      noOfRetailShops: data.noOfRetailShops as number,
      unemploymentRate: data.unemploymentRate as number,
      employmentInvestmentLand: data.employmentInvestmentLand as number,
      numOfRegisteredCompanies: data.numOfRegisteredCompanies as number,
      numOfBusinessParks: data.numOfBusinessParks as number,
      averageHousingCost: data.averageHousingCost as number,
      averageWageEarnings: data.averageWageEarnings as number,
    },
    create: {
      workingAgePopulation: data?.workingAgePopulation as number,
      labourDemand: data.labourDemand as number,
      noOfRetailShops: data.noOfRetailShops as number,
      unemploymentRate: data.unemploymentRate as number,
      employmentInvestmentLand: data.employmentInvestmentLand as number,
      numOfRegisteredCompanies: data.numOfRegisteredCompanies as number,
      numOfBusinessParks: data.numOfBusinessParks as number,
      averageHousingCost: data.averageHousingCost as number,
      averageWageEarnings: data.averageWageEarnings as number,
      district: { connect: { id: data.districtId } },
    },
  });

  await prisma.$disconnect();
  return updatedOrCreatedEconomicData;
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
        id: data.id,
      },
      update: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl as string,
      },
      create: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl as string,
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
        id: data.id,
      },
      update: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl as string,
      },
      create: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl as string,
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
        id: data.id,
      },
      update: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl as string,
      },
      create: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl as string,
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
      id: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
      imageUrl: data.imageUrl as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      imageUrl: data.imageUrl as string,
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
const updateOrCreateFeatureArticle = async (data: Partial<DataProps>) => {
  const updatedFeatureArticle = await prisma.featureArticle.upsert({
    where: {
      id: data.id,
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
  return updatedFeatureArticle;
};

/**
 * 
 * @param data 
 * @returns 
 */
const updateOrCreateOnlineDigitilisation = async (data: Partial<DataProps>) => {
  const updatedFeatureArticle = await prisma.topicalBusinessIssues.upsert({
    where: {
      id: data.id,
      countyId: data.countyId,
    },
    update: {
      onlineDigitilisation: {
        update: {
          title: data.title as string,
          content: data.content as string,
          imageUrl: data.imageUrl as string,
        },
      },
    },
    create: {
      onlineDigitilisation: {
        create: {
          title: data.title as string,
          content: data.content as string,
          imageUrl: data.imageUrl as string ?? '',
        },
      },
     county: { connect: { id: data.countyId as string } },
    },
  });
  return updatedFeatureArticle;
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
  updateOrCreateDistrictWhyInvestIn,
  updateOrCreateEconomicData,
  updateOrCreateDistrictBusinessParks,
  updateOrCreateDistrictCouncilGrants,
  updateOrCreateDistrictCouncilServices,
  updateOrCreateDistrictLocalNews,
  updateOrCreateFeatureArticle,
  updateOrCreateOnlineDigitilisation,
};

export default editorService;
