import { PartnerType, PrismaClient, Role } from "@prisma/client";
import { DataProps, PartnerData } from "../../types";

const prisma = new PrismaClient();

/**
 *  @description - create a partner data
 * @param data 
 * @returns 
 */
const createPartnerData = async (data: DataProps) => {
  const newPartner = await prisma.user.upsert({
    where: {
      email: data.email,
    },
    update: {},
    create: {
      name: data.name,
      email: data.email,
      role: Role.PARTNER,
    },
  });

  if (newPartner) {
    await prisma.organisation.upsert({
      where: {
        name: data.organisation,
      },
      update: {},
      create: {
        name: data.organisation,
        user: { connect: { id: newPartner.id } },
      }
    })

    await prisma.partnerData.create({
      data: {
        partner: { connect: { id: newPartner.id } },
        organisation: {
          connect: { name: data.organisation },
        },
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


/**
 *  @description - get all partner data by partner id
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
        }
      },
      partner: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      valueCategory: true,
      partnerType: true,
      projectsResponsibleFor: true,
      closingDate: true,
      position: true,
      isEmail: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  await prisma.$disconnect();
  return partnerData;
};

/**
 * @description - get partner data by id
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
 * @description - update partner data
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

export const partnerService = {
  createPartnerData,
  getAllPartnerData,
  getAllPartnersData,
  getPartnerDataById,
  updatePartnerData,
  deletePartnerData,
};
