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
      },
    });
  }
  return updatedCounty;
};

/**
 *
 * @param data
 */
const removeCounty = async (data: Partial<DataProps>) => {};

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

const getDistrictById = async (data: Partial<DataProps>) => {
  const district = await prisma.district.findUnique({
    where: {
      id: data.id,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      whyInvest: {
        select: {
          id: true,
          title: true,
          content: true,
          imageUrl: true,
        },
      },
    },
  });
  await prisma.$disconnect();
  return district;
};

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
      },
    });
  }
  await prisma.$disconnect();
  return updatedDistrict;
};
const deleteDistrict = async (data: Partial<DataProps>) => {};

const createDistrictWhyInvestIn = async (data: Partial<DataProps>) => {
  const newDistrictWhyInvest = await prisma.whyInvest.create({
    data: {
      title: data.title as string,
      content: data.content as string,
      imageUrl: data.imageUrl as string,
      district: { connect: { id: data.districtId } },
    },
  });
  await prisma.$disconnect();
  return newDistrictWhyInvest;
};

const updateOrCreateDistrictWhyInvestIn = async (data: Partial<DataProps>) => {
  const districtWhyInvest = await prisma.whyInvest.findUnique({
    where: {
      id: data.id,
    },
  });
  let updatedOrCreatedDistrictWhyInvestIn;
  if (!districtWhyInvest) {
    updatedOrCreatedDistrictWhyInvestIn = await prisma.whyInvest.create({
      data: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl as string,
        district: { connect: { id: data.districtId as string } },
      },
    });
  }

  updatedOrCreatedDistrictWhyInvestIn = await prisma.whyInvest.update({
    where: {
      id: data.id,
    },
    data: {
      title: data.title ? (data.title as string) : districtWhyInvest?.imageUrl,
      content: data.content
        ? (data.content as string)
        : districtWhyInvest?.imageUrl,
      imageUrl: data?.imageUrl
        ? (data.imageUrl as string)
        : districtWhyInvest?.imageUrl,
    },
  });
 await prisma.$disconnect();
 return updatedOrCreatedDistrictWhyInvestIn;
}


const updateOrCreateEconomicData = async (data: Partial<DataProps>) => {
  const districtEconomicData = await prisma.economicData.findUnique({
    where: {
      id: data.id,
    },
  });
  let updatedOrCreatedEconomicData;
  if (!districtEconomicData) {
    updatedOrCreatedEconomicData = await prisma.economicData.create({
      data: {
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
  }

  updatedOrCreatedEconomicData = await prisma.economicData.update({
    where: {
      id: data.id,
    },
    data: {
      workingAgePopulation: data?.workingAgePopulation
        ? (data?.workingAgePopulation as number)
        : districtEconomicData?.workingAgePopulation,
      labourDemand: data.labourDemand
        ? (data.labourDemand as number)
        : districtEconomicData?.labourDemand,
      noOfRetailShops: data.noOfRetailShops
        ? (data.noOfRetailShops as number)
        : districtEconomicData?.noOfRetailShops,
      unemploymentRate: data.unemploymentRate
        ? (data.unemploymentRate as number)
        : districtEconomicData?.unemploymentRate,
      employmentInvestmentLand: data.employmentInvestmentLand
        ? (data.employmentInvestmentLand as number)
        : districtEconomicData?.employmentInvestmentLand,
      numOfRegisteredCompanies: data.numOfRegisteredCompanies
        ? (data.numOfRegisteredCompanies as number)
        : districtEconomicData?.numOfRegisteredCompanies,
      numOfBusinessParks: data.numOfBusinessParks
        ? (data.numOfBusinessParks as number)
        : districtEconomicData?.numOfBusinessParks,
      averageHousingCost: data.averageHousingCost
        ? (data.averageHousingCost as number)
        : districtEconomicData?.averageHousingCost,
      averageWageEarnings: data.averageWageEarnings
        ? (data.averageWageEarnings as number)
        : districtEconomicData?.averageWageEarnings,
    },
  });

  await prisma.$disconnect();
  return updatedOrCreatedEconomicData;
};

const updateOrCreateDistrictBusinessParks = async (data: Partial<DataProps>) => {
  const districtBusinessParks = await prisma.businessPark.findUnique({
    where: {
      id: data.id,
    },
  });
  let updatedOrCreatedDistrictBusinessParks;
  if (!districtBusinessParks) {
    updatedOrCreatedDistrictBusinessParks = await prisma.businessPark.create({
      data: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl as string,
        district: { connect: { id: data.districtId as string } },
      },
    });
  }

  updatedOrCreatedDistrictBusinessParks = await prisma.businessPark.update({
    where: {
      id: data.id,
    },
    data: {
      title: data.title ? (data.title as string) : districtBusinessParks?.imageUrl,
      content: data.content
        ? (data.content as string)
        : districtBusinessParks?.imageUrl,
      imageUrl: data?.imageUrl
        ? (data.imageUrl as string)
        : districtBusinessParks?.imageUrl,
    },
  });
  await prisma.$disconnect();
  return updatedOrCreatedDistrictBusinessParks;
};

const updateOrCreateDistrictCouncilGrants = async (
  data: Partial<DataProps>
) => {
  const districtCouncilGrants = await prisma.councilGrant.findUnique({
    where: {
      id: data.id,
    },
  });
  let updatedOrCreatedDistrictCouncilGrants;
  if (!districtCouncilGrants) {
    updatedOrCreatedDistrictCouncilGrants = await prisma.councilGrant.create({
      data: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl as string,
        district: { connect: { id: data.districtId as string } },
      },
    });
  }

  updatedOrCreatedDistrictCouncilGrants = await prisma.councilGrant.update({
    where: {
      id: data.id,
    },
    data: {
      title: data.title
        ? (data.title as string)
        : districtCouncilGrants?.imageUrl,
      content: data.content
        ? (data.content as string)
        : districtCouncilGrants?.imageUrl,
      imageUrl: data?.imageUrl
        ? (data.imageUrl as string)
        : districtCouncilGrants?.imageUrl,
    },
  });
  await prisma.$disconnect();
  return updatedOrCreatedDistrictCouncilGrants;
};


const updateOrCreateDistrictCouncilServices = async (
  data: Partial<DataProps>
) => {
  const districtCouncilServices = await prisma.councilService.findUnique({
    where: {
      id: data.id,
    },
  });
  let updatedOrCreatedDistrictCouncilServices;
  if (!districtCouncilServices) {
    updatedOrCreatedDistrictCouncilServices = await prisma.councilService.create({
      data: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl as string,
        district: { connect: { id: data.districtId as string } },
      },
    });
  }

  updatedOrCreatedDistrictCouncilServices = await prisma.councilService.update({
    where: {
      id: data.id,
    },
    data: {
      title: data.title
        ? (data.title as string)
        : districtCouncilServices?.imageUrl,
      content: data.content
        ? (data.content as string)
        : districtCouncilServices?.imageUrl,
      imageUrl: data?.imageUrl
        ? (data.imageUrl as string)
        : districtCouncilServices?.imageUrl,
    },
  });
  await prisma.$disconnect();
  return updatedOrCreatedDistrictCouncilServices;
};
const updateOrCreateDistrictLocalNews = async (
  data: Partial<DataProps>
) => {
  const districtLocalNews = await prisma.localNews.findUnique({
    where: {
      id: data.id,
    },
  });
  let updatedOrCreatedDistrictLocalNews;
  if (!districtLocalNews) {
    updatedOrCreatedDistrictLocalNews = await prisma.localNews.create({
      data: {
        title: data.title as string,
        content: data.content as string,
        imageUrl: data.imageUrl as string,
        district: { connect: { id: data.districtId as string } },
      },
    });
  }

  updatedOrCreatedDistrictLocalNews = await prisma.localNews.update({
    where: {
      id: data.id,
    },
    data: {
      title: data.title
        ? (data.title as string)
        : districtLocalNews?.imageUrl,
      content: data.content
        ? (data.content as string)
        : districtLocalNews?.imageUrl,
      imageUrl: data?.imageUrl
        ? (data.imageUrl as string)
        : districtLocalNews?.imageUrl,
    },
  });
  await prisma.$disconnect();
  return updatedOrCreatedDistrictLocalNews;
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
  createDistrictWhyInvestIn,
  updateOrCreateDistrictWhyInvestIn,
  updateOrCreateEconomicData,
  updateOrCreateDistrictBusinessParks,
  updateOrCreateDistrictCouncilGrants,
  updateOrCreateDistrictCouncilServices,
  updateOrCreateDistrictLocalNews,
};

export default editorService
