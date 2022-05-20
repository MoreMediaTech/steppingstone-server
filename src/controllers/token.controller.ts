import { tokenService } from './../services/token.service';
import createError from "http-errors";
import { Request, Response } from "express";

const refreshToken = async (req: Request, res: Response) => {
    try {
        const accessToken = await tokenService.refreshToken(req, res);
        res.json({ accessToken });
    } catch (error) {
        throw new createError.Forbidden();
    }
}

export {
    refreshToken,
}