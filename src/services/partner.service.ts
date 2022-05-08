import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { PartnerData } from "../../types";

const prisma = new PrismaClient();


const create = async (data: PartnerData, id: string) => {
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
                buisnessType: data.buisnessType,
                website: data.website,
                areaOfOperation: data.areaOfOperation,
            }
        });
        await prisma.$disconnect();
        return partnerData;
    } catch (error) {
        return new createError.BadRequest("Unable to create partner data" + error);
    }
};
const getAllPartnerData = async (id: string) => {
    try {
        const partnerData = await prisma.partnerData.findMany({
            where: {
                authorId: id
            }
        });
        return partnerData;
    } catch (error) {
        return new createError.NotFound("Unable to get all partners data" + error);
    }
};
const getAllPartnersData = async () => {
    try {
        const partnerData = await prisma.partnerData.findMany();
        return partnerData;
    } catch (error) {
        return new createError.NotFound("Unable to get all partners data" + error);
    }
};

export { create, getAllPartnerData, getAllPartnersData };
