import createError from "http-errors";
import { PartnerType, PrismaClient, Role } from "@prisma/client";
import { DataProps, PartnerData } from "../../types";

const prisma = new PrismaClient();

const createPartnerData = async (data: DataProps) => {
  const newPartner = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      role: Role.PARTNER,
    },
  });
  if (newPartner) {
    await prisma.partnerData.create({
      data: {
        partner: { connect: { id: newPartner.id } },
        organisation: {
          create: {
            name: data.organisation,
            user: { connect: { id: newPartner.id } },
          },
        },
        category: data.category,
        businessType: data.businessType,
        website: data.website,
        areaOfOperation: data.areaOfOperation,
        valueCategory: data.valueCategory,
        partnerType: data.partnerType as PartnerType,
        projectsResponsibleFor: data.projectsResponsibleFor,
        closingDate: data.closingDate,
        position: data.position,
        isEmail: data.isEmail,
      },
    });
  }
  await prisma.$disconnect();
  return { success: true, message: "Partner data submitted successfully" };
};

const getAllPartnerData = async (id: string) => {
  const partnerData = await prisma.partnerData.findMany({
    where: {
      partnerId: id,
    },
  });
  return partnerData;
};
const getAllPartnersData = async () => {
  const partnerData = await prisma.partnerData.findMany();
  return partnerData;
};

const getPartnerDataById = async (id: string) => {
  const partnerData = await prisma.partnerData.findUnique({
    where: {
      id,
    },
  });
  return partnerData;
};

const updatePartnerData = async (id: string, data: PartnerData) => {
  const existingPartnerData = await prisma.partnerData.findUnique({
    where: {
      id,
    },
  });

  if (existingPartnerData) {
    await prisma.partnerData.update({
      where: {
        id,
      },
      data: {
        category: data.category,
        businessType: data.businessType,
        website: data.website,
        areaOfOperation: data.areaOfOperation,
        valueCategory: data.valueCategory,
        partnerType: data.partnerType as PartnerType,
        projectsResponsibleFor: data.projectsResponsibleFor,
        closingDate: data.closingDate,
        position: data.position,
        isEmail: data.isEmail,
        organisation: {
          update: {
            name: data.organisation,
          }
        }
      },
    });
  }
  return { success: true, message: "Partner data updated successfully" };
};

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
  createPartnerData,
  getAllPartnerData,
  getAllPartnersData,
  getPartnerDataById,
  updatePartnerData,
  deletePartnerData,
};
