import { Response } from "express";
import createError from "http-errors";
import { RequestWithUser } from "../../../types";

import { analyticsService } from "../services/analytics.service";

const getAnalytics = async (req: RequestWithUser, res: Response) => {
  try {
    const response = await analyticsService.getAnalytics();
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

const addOnlineUser = async (req: RequestWithUser, res: Response) => {
  try {
    const response = await analyticsService.addOnlineUser(
      req.user?.id as string,
      req.body
    );
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

const viewed = async (req: RequestWithUser, res: Response) => {};

const recordLoadTimes = async (req: RequestWithUser, res: Response) => {
  try {
    const response = await analyticsService.recordLoadTimes(
      req.user?.id as string,
      req.body
    );
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

export const analyticsController = {
  addOnlineUser,
  viewed,
  getAnalytics,
  recordLoadTimes,
};
