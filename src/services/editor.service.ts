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
      supportForStartups: {
        select: {
          id: true,
          vatAndTax: true,
          marketResearch: true,
          LegalChecklist: true,
          findStartupFunding: true,
          businessPlans: true,
          businessInsurance: true,
          becomeAGreenerBusiness: true,
        },
      },
      topicalBusinessIssues: {
        select: {
          id: true,
          onlineDigitilisation: true,
          helpForSocialEnterprises: true,
          LGBTQAndDisabilities: true,
          helpForCarbonAndNetZeroTargets: true,
          helpForCovidBusinessSupport: true,
          helpForHeritageAndTourism: true,
          helpForMentalHealthAndWellbeing: true,
        },
      },
      businessNewsAndInformation: true,
      growingABusiness: {
        select: {
          id: true,
          tradingOverseas: true,
          operateMoreEfficiently: true,
          improveSkills: true,
          findTendersAndContracts: true,
          findNewMarkets: true,
          findFunding: true,
          employPeople: true,
          commercialProperty: true,
          developProductsAndServices: true,
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
     if (newCounty) {
       await prisma.$transaction([
         prisma.supportForStartup.create({
           data: {
             county: { connect: { id: newCounty.id } },
           },
         }),
         prisma.topicalBusinessIssues.create({
           data: {
             county: { connect: { id: newCounty.id } },
           },
         }),
         prisma.growingABusiness.create({
           data: {
             county: { connect: { id: newCounty.id } },
           },
         }),
       ]);
     }
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
      economicData: true,
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
  return updatedFeatureArticle;
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

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateCountyBNI = async (data: Partial<DataProps>) => {
  const updatedCountyBNI = await prisma.businessNewsAndInformation.upsert({
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
  return updatedCountyBNI;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateOnlineDigitilisation = async (data: Partial<DataProps>) => {
  const updatedOnlineDigitalisation = await prisma.onlineDigitilisation.upsert({
    where: {
      topicalBusinessIssuesId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      topicalBusinessIssues: { connect: { id: data.id as string } },
    },
  });
  return updatedOnlineDigitalisation;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateSocialEnterprises = async (data: Partial<DataProps>) => {
  const updatedSocialEnterprises = await prisma.helpForSocialEnterprises.upsert(
    {
      where: {
        topicalBusinessIssuesId: data.id,
      },
      update: {
        title: data.title as string,
        content: data.content as string,
      },
      create: {
        title: data.title as string,
        content: data.content as string,
        topicalBusinessIssues: { connect: { id: data.id as string } },
      },
    }
  );
  return updatedSocialEnterprises;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateLGBTQAndDisabilities = async (data: Partial<DataProps>) => {
  const updatedLGBTQAndDisabilities = await prisma.lGBTQAndDisabilities.upsert({
    where: {
      topicalBusinessIssuesId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      topicalBusinessIssues: { connect: { id: data.id as string } },
    },
  });
  return updatedLGBTQAndDisabilities;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateMHW = async (data: Partial<DataProps>) => {
  const updatedMHW = await prisma.helpForMentalHealthAndWellbeing.upsert({
    where: {
      topicalBusinessIssuesId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      topicalBusinessIssues: { connect: { id: data.id as string } },
    },
  });
  return updatedMHW;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateHeritageAndTourism = async (data: Partial<DataProps>) => {
  const updatedHeritageAndTourism =
    await prisma.helpForHeritageAndTourism.upsert({
      where: {
        topicalBusinessIssuesId: data.id,
      },
      update: {
        title: data.title as string,
        content: data.content as string,
      },
      create: {
        title: data.title as string,
        content: data.content as string,
        topicalBusinessIssues: { connect: { id: data.id as string } },
      },
    });
  return updatedHeritageAndTourism;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateBusinessSupport = async (data: Partial<DataProps>) => {
  const updatedCovidBusinessSupport =
    await prisma.helpForCovidBusinessSupport.upsert({
      where: {
        topicalBusinessIssuesId: data.id,
      },
      update: {
        title: data.title as string,
        content: data.content as string,
      },
      create: {
        title: data.title as string,
        content: data.content as string,
        topicalBusinessIssues: { connect: { id: data.id as string } },
      },
    });
  return updatedCovidBusinessSupport;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateCNZT = async (data: Partial<DataProps>) => {
  const updatedCNZT = await prisma.helpForCarbonAndNetZeroTargets.upsert({
    where: {
      topicalBusinessIssuesId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      topicalBusinessIssues: { connect: { id: data.id as string } },
    },
  });
  return updatedCNZT;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateVatAndTax = async (data: Partial<DataProps>) => {
  const updatedVatAndTax = await prisma.vatAndTax.upsert({
    where: {
      supportForStartupId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      supportForStartup: { connect: { id: data.id as string } },
    },
  });
  return updatedVatAndTax;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateMarketResearch = async (data: Partial<DataProps>) => {
  const updatedMarketResearch = await prisma.marketResearch.upsert({
    where: {
      supportForStartupId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      supportForStartup: { connect: { id: data.id as string } },
    },
  });
  return updatedMarketResearch;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateLegalChecklist = async (data: Partial<DataProps>) => {
  const updatedLegalChecklist = await prisma.legalChecklist.upsert({
    where: {
      supportForStartupId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      supportForStartup: { connect: { id: data.id as string } },
    },
  });
  return updatedLegalChecklist;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateFindStartupFunding = async (data: Partial<DataProps>) => {
  const updatedFindStartupFunding = await prisma.findStartupFunding.upsert({
    where: {
      supportForStartupId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      supportForStartup: { connect: { id: data.id as string } },
    },
  });
  return updatedFindStartupFunding;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateBusinessPlan = async (data: Partial<DataProps>) => {
  const updatedBusinessPlans = await prisma.businessPlans.upsert({
    where: {
      supportForStartupId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      supportForStartup: { connect: { id: data.id as string } },
    },
  });
  return updatedBusinessPlans;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateBusinessInsurance = async (data: Partial<DataProps>) => {
  const updatedBusinessInsurance = await prisma.businessInsurance.upsert({
    where: {
      supportForStartupId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      supportForStartup: { connect: { id: data.id as string } },
    },
  });
  return updatedBusinessInsurance;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateBGB = async (data: Partial<DataProps>) => {
  const updatedBGB = await prisma.becomeAGreenerBusiness.upsert({
    where: {
      supportForStartupId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      supportForStartup: { connect: { id: data.id as string } },
    },
  });
  return updatedBGB;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateTradingOverseas = async (data: Partial<DataProps>) => {
  const updatedTradingOverseas = await prisma.tradingOverseas.upsert({
    where: {
      growingABusinessId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      growingABusiness: { connect: { id: data.id as string } },
    },
  });
  return updatedTradingOverseas;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateOME = async (data: Partial<DataProps>) => {
  const updatedOME = await prisma.operateMoreEfficiently.upsert({
    where: {
      growingABusinessId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      growingABusiness: { connect: { id: data.id as string } },
    },
  });
  return updatedOME;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateImproveSkills = async (data: Partial<DataProps>) => {
  const updatedImproveSkills = await prisma.improveSkills.upsert({
    where: {
      growingABusinessId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      growingABusiness: { connect: { id: data.id as string } },
    },
  });
  return updatedImproveSkills;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateFindTAndC = async (data: Partial<DataProps>) => {
  const updatedFindTandC = await prisma.findTendersAndContracts.upsert({
    where: {
      growingABusinessId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      growingABusiness: { connect: { id: data.id as string } },
    },
  });
  return updatedFindTandC;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateFindNewMarkets = async (data: Partial<DataProps>) => {
  const updatedFindNewMarkets = await prisma.findNewMarkets.upsert({
    where: {
      growingABusinessId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      growingABusiness: { connect: { id: data.id as string } },
    },
  });
  return updatedFindNewMarkets;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateFindFunding = async (data: Partial<DataProps>) => {
  const updatedFindFunding = await prisma.findFunding.upsert({
    where: {
      growingABusinessId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      growingABusiness: { connect: { id: data.id as string } },
    },
  });
  return updatedFindFunding;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateCommercialProperty = async (data: Partial<DataProps>) => {
  const updatedCommercialProperty = await prisma.commercialProperty.upsert({
    where: {
      growingABusinessId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,
      growingABusiness: { connect: { id: data.id as string } },
    },
  });
  return updatedCommercialProperty;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateEmployPeople = async (data: Partial<DataProps>) => {
  const updatedEmployPeople = await prisma.employPeople.upsert({
    where: {
      growingABusinessId: data.id,
    },
    update: {
      title: data.title as string,
      content: data.content as string,
    },
    create: {
      title: data.title as string,
      content: data.content as string,

      growingABusiness: { connect: { id: data.id as string } },
    },
  });
  return updatedEmployPeople;
};

/**
 *
 * @param data
 * @returns
 */
const updateOrCreateDevelopProductsAndServices = async (
  data: Partial<DataProps>
) => {
  const updatedDevelopProductsAndServices =
    await prisma.developProductsAndServices.upsert({
      where: {
        growingABusinessId: data.id,
      },
      update: {
        title: data.title as string,
        content: data.content as string,
      },
      create: {
        title: data.title as string,
        content: data.content as string,
        growingABusiness: { connect: { id: data.id as string } },
      },
    });
  return updatedDevelopProductsAndServices;
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
  updateOrCreateCountyWelcome,
  updateOrCreateCountyNews,
  updateOrCreateCountyLEP,
  updateOrCreateCountyBNI,
  updateOrCreateSocialEnterprises,
  updateOrCreateLGBTQAndDisabilities,
  updateOrCreateMHW,
  updateOrCreateHeritageAndTourism,
  updateOrCreateBusinessSupport,
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
  updateOrCreateEmployPeople,
  updateOrCreateDevelopProductsAndServices,
};

export default editorService;
