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
    id: string
    title: string
    content: string
    imageUrl: string
  }
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

const updateDistrictWhyInvestIn = async (data: Partial<DataProps>) => {

    const updatedDistrictWhyInvestIn = await prisma.whyInvest.upsert({
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
        district: { connect: { id: data.districtId } },
      },
    });
    await prisma.$disconnect();
  return updatedDistrictWhyInvestIn;
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
  updateDistrictWhyInvestIn,
};

export default editorService;
