import { tokenService } from "../services/token.service";
import createError from "http-errors";
import { Request, Response } from "express";

/**
 * @description - This middleware is used to refresh the access token
 * @route -  GET /refresh-token
 * @param req
 * @param res
 */
const refreshToken = async (req: Request, res: Response) => {
  try {
    const accessToken = await tokenService.refreshToken(req, res);

    res.json({ token: accessToken });
  } catch (error) {
    throw new createError.Forbidden();
  }
};

export { refreshToken };
