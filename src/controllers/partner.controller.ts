import { Response } from "express";
import createError from "http-errors";
import { RequestWithUser } from "../../types";
import { create, getAllPartnerData, getAllPartnersData } from '../services/partner.service';


const getPartnerData = async (req: RequestWithUser, res: Response) => {
    const { id } = req.params;
    try {
        const partnerData =  await getAllPartnerData(id);
        if(partnerData) res.status(200).json(partnerData);
    } catch (error) {
        return new createError.NotFound('PartnerData not found');
    }
};
const getPartnersData = async (req: RequestWithUser, res: Response) => {
    try {
        const partnersData = await getAllPartnersData();
        if(partnersData) res.status(200).json(partnersData);
    } catch (error) {
        return new createError.NotFound('PartnersData not found');
    }
};
const createPartnerData = async (req: RequestWithUser, res: Response) => {
    const { id } = req.params;
    try {
        const partnerData = await create(req.body, id);
    } catch (error) {
        
    }
};

export { getPartnerData, createPartnerData, getPartnersData };
