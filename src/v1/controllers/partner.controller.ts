import { Request, Response } from "express";
import createError from "http-errors";
import { partnerService } from "../services/partner.service";

/**
 * @description - Create one partner data
 * @route POST /directory
 * @access Private
 * @param req
 * @param res
 * @returns
 */
const createPartnerData = async (req: Request, res: Response) => {
  try {
    const partnerData = await partnerService.createPartnerData(req.body);
    if (partnerData) res.status(200).json(partnerData);
  } catch (error) {
    return new createError.BadRequest("Unable to create partner data");
  }
};

/**
 * @description - Get all partner data by partner(user) id
 * @route GET /all/:id
 * @access Private
 * @param req
 * @param res
 * @returns
 */
const getAllPartnerData = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const partnerData = await partnerService.getAllPartnerData(id);
    if (partnerData) res.status(200).json(partnerData);
  } catch (error) {
    return new createError.NotFound("PartnerData not found");
  }
};

/**
 * @description - Get all partner data by partner(user) id
 * @route GET /directory
 * @access Private
 * @param req
 * @param res
 * @returns
 */
const getAllPartnersData = async (req: Request, res: Response) => {
  try {
    const partnersData = await partnerService.getAllPartnersData();
    if (partnersData) res.status(200).json(partnersData);
  } catch (error) {
    return new createError.NotFound("PartnersData not found");
  }
};

/**
 * @description - Get partner data by id
 * @route GET /directory/:id
 * @access Private
 * @param req
 * @param res
 * @returns
 */
const getPartnerDataById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const partnerData = await partnerService.getPartnerDataById(id);
    if (partnerData) res.status(200).json(partnerData);
  } catch (error) {
    return new createError.NotFound("PartnerData not found");
  }
};

/**
 * @description - Update one partner data by id
 * @route PUT /directory/:id
 * @access Private
 * @param req
 * @param res
 * @returns
 */
const updatePartnerData = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updateData = await partnerService.updatePartnerData(id, req.body);
    if (updateData) res.status(200).json(updateData);
  } catch (error) {
    return new createError.NotFound("Unable to update partner data");
  }
};

/**
 * @description - Delete one partner data by id
 * @route DELETE /directory/:id
 * @access Private
 * @param req
 * @param res
 * @returns
 */
const deletePartnerDataById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleteData = await partnerService.deletePartnerData(id);
    if (deleteData) res.status(200).json(deleteData);
  } catch (error) {
    return new createError.NotFound("Unable to delete partner data");
  }
};
/**
 * @description - Delete many partner data
 * @route DELETE /delete-directories
 * @access Private
 * @param req
 * @param res
 * @returns
 */
const deleteManyPartnerData = async (req: Request, res: Response) => {
  try {
    const deleteData = await partnerService.deleteManyPartnerData({
      ...req.body,
    });
    if (deleteData) res.status(200).json(deleteData);
  } catch (error) {
    return new createError.NotFound("Unable to delete partner data");
  }
};

const partnerController = {
  getAllPartnerData,
  createPartnerData,
  getAllPartnersData,
  getPartnerDataById,
  updatePartnerData,
  deletePartnerDataById,
  deleteManyPartnerData,
};

export default partnerController;
