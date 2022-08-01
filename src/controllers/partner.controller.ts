import { Response } from "express";
import createError from "http-errors";
import { RequestWithUser } from "../../types";
import { partnerService } from "../services/partner.service";

const createPartnerData = async (req: RequestWithUser, res: Response) => {

  try {
    const partnerData = await partnerService.createPartnerData(req.body);
    if (partnerData) res.status(200).json(partnerData);
  } catch (error) {
    return new createError.BadRequest("Unable to create partner data");
  }
};

const getAllPartnerData = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  try {
    const partnerData = await partnerService.getAllPartnerData(id);
    if (partnerData)
      res.status(200).json(partnerData);
  } catch (error) {
    return new createError.NotFound("PartnerData not found");
  }
};
const getAllPartnersData = async (req: RequestWithUser, res: Response) => {
  console.log('fetching')
  try {
    const partnersData = await partnerService.getAllPartnersData();
    if (partnersData) res.status(200).json(partnersData);
  } catch (error) {
    return new createError.NotFound("PartnersData not found");
  }
};

const getPartnerDataById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  try {
    const partnerData = await partnerService.getPartnerDataById(id);
    if (partnerData) res.status(200).json(partnerData);
  } catch (error) {
    return new createError.NotFound("PartnerData not found");
  }
};

const updatePartnerData = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  try {
    const updateData = await partnerService.updatePartnerData(id, req.body);
    if (updateData) res.status(200).json(updateData);
  } catch (error) {
    return new createError.NotFound("Unable to update partner data");
  }
};

const deletePartnerDataById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  try {
    const deleteData = await partnerService.deletePartnerData(id);
    if (deleteData) res.status(200).json(deleteData);
  } catch (error) {
    return new createError.NotFound("Unable to delete partner data");
  }
};

export {
  getAllPartnerData,
  createPartnerData,
  getAllPartnersData,
  getPartnerDataById,
  updatePartnerData,
  deletePartnerDataById,
};
