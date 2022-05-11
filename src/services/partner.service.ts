import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { PartnerData } from "../../types";

const prisma = new PrismaClient();

const create = async (data: PartnerData, id: string) => {
    console.log(data);
  try {
    const partnerData = await prisma.partnerData.create({
      data: {
        title: data.title,
        author: { connect: { id } },
        organisation: {
          connect: { id: data.organisation },
        },
        description: data.description,
        category: data.category,
        businessType: data.businessType,
        website: data.website,
        areaOfOperation: data.areaOfOperation,
      },
    });
    await prisma.$disconnect();
    return { message: "Partner data submitted successfully" };
  } catch (error) {
    return new createError.BadRequest("Unable to create partner data" + error);
  }
};
const getAllPartnerData = async (id: string) => {
  try {
    const partnerData = await prisma.partnerData.findMany({
      where: {
        authorId: id,
      },
    });
    return partnerData;
  } catch (error) {
    return new createError.BadRequest("Unable to get all partner data" + error);
  }
};
const getAllPartnersData = async () => {
  try {
    const partnerData = await prisma.partnerData.findMany();
    return partnerData;
  } catch (error) {
    return new createError.BadRequest("Unable to get all partners data" + error);
  }
};

const getPartnerDataById = async (id: string) => {
  try {
    const partnerData = await prisma.partnerData.findUnique({
      where: {
        id,
      },
    });
    return partnerData;
  } catch (error) {
    return new createError.BadRequest("Unable to get partner data" + error);
  }
};

const updatePartnerData = async (id: string, data: PartnerData) => {
    try {
        const updateData = await prisma.partnerData.update({
          where: {
            id,
          },
          data: {
            title: data.title,
            description: data.description,
            category: data.category,
            businessType: data.businessType,
            website: data.website,
            areaOfOperation: data.areaOfOperation,
            isLive: data.isLive,
            isHidden: data.isHidden,
            isApproved: data.isApproved,
            status: data.status,
          },
        });
        return { message: "Partner data updated successfully" };
    } catch (error) {
        return new createError.BadRequest("Unable to update partner data" + error);
    }
}

const deletePartnerData = async (id: string) => {
  try {
    const deleteData = await prisma.partnerData.delete({
      where: {
        id,
      },
    });
    return { message: "Partner data deleted successfully" };
  } catch (error) {
    return new createError.BadRequest("Unable to delete partner data" + error);
  }
};

export const partnerService = {
  create,
  getAllPartnerData,
  getAllPartnersData,
  getPartnerDataById,
    updatePartnerData,
  deletePartnerData,
};
