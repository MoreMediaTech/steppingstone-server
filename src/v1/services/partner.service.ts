import { PartnerType, PrismaClient, Role } from "@prisma/client";
import { DataProps, PartnerData } from "../../../types";

const prisma = new PrismaClient();

/**
 *  @description - create a partner data
 * @route POST /directory
 * @param data
 * @returns
 */
const createPartnerData = async (data: DataProps) => {
  const partner = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (partner && partner.role === Role.PARTNER) {
    return { success: false, message: "Partner already exists" };
  }

  const newPartner = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      role: Role.PARTNER,
    },
  });

  await prisma.organisation.upsert({
    where: {
      name: data.organisation,
    },
    update: {},
    create: {
      name: data.organisation,
      user: { connect: { id: newPartner.id } },
    },
  });

  await prisma.partnerData.create({
    data: {
      partner: { connect: { id: newPartner.id } },
      organisation: {
        connect: { name: data.organisation },
      },
      businessType: data.businessType,
      website: data.website,
      projectsResponsibleFor: data.projectsResponsibleFor,
      closingDate: data.closingDate,
      position: data.position,
      partnerType: PartnerType.PARTNER,
    },
  });

  await prisma.$disconnect();
  return { success: true, message: "Partner data submitted successfully" };
};

/**
 *  @description - get all partner data by partner id
 * @route GET /all/:id
 * @access Private
 * @param id
 * @returns
 */
const getAllPartnerData = async (id: string) => {
  const partnerData = await prisma.partnerData.findMany({
    where: {
      partnerId: id,
    },
  });
  await prisma.$disconnect();
  return partnerData;
};

/**
 * @description - get all partners data
 * @route GET /directory
 * @access Private
 * @returns an array of partners data
 */
const getAllPartnersData = async () => {
  const partnerData = await prisma.partnerData.findMany({
    select: {
      id: true,
      organisation: {
        select: {
          id: true,
          name: true,
        },
      },
      partner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      valueCategory: true,
      partnerType: true,
      projectsResponsibleFor: true,
      closingDate: true,
      position: true,
      isEmail: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  await prisma.$disconnect();
  return partnerData;
};

/**
 * @description - get partner data by id
 * @route GET /directory/:id
 * @access Private
 * @param id
 * @returns
 */
const getPartnerDataById = async (id: string) => {
  const partnerData = await prisma.partnerData.findUnique({
    where: {
      id,
    },
  });
  await prisma.$disconnect();
  return partnerData;
};

/**
 * @description - update partner data b id
 * @route PUT /directory/:id
 * @access Private
 * @param id
 * @param data
 * @returns a boolean confirming successful update and a message
 */
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
          upsert: {
            update: { name: data.organisation },
            create: {
              name: data.organisation,
              user: { connect: { id: existingPartnerData.partnerId } },
            },
          },
        },
      },
    });
  }
  await prisma.$disconnect();
  return { success: true, message: "Partner data updated successfully" };
};

/**
 * @description - delete partner data by id
 * @route DELETE /directory/:id
 * @access Private
 * @param id
 * @returns
 */
const deletePartnerData = async (id: string) => {
  await prisma.partnerData.delete({
    where: {
      id,
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Partner data deleted successfully" };
};

/**
 * @description - delete many partner data
 * @route DELETE /delete-directories
 * @access Private
 * @param data - ids - an array of ids
 * @returns
 */
const deleteManyPartnerData = async (data: { ids: string[] }) => {
  await prisma.partnerData.deleteMany({
    where: {
      id: {
        in: data.ids,
      },
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Partner data deleted successfully" };
};

export const partnerService = {
  createPartnerData,
  getAllPartnerData,
  getAllPartnersData,
  getPartnerDataById,
  updatePartnerData,
  deletePartnerData,
  deleteManyPartnerData,
};
