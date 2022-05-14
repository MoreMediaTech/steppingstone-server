import jwt  from 'jsonwebtoken';
import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { generateToken, generateRefreshToken } from "../utils/jwt";

const prisma = new PrismaClient();

const refreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies.ss_refresh_token) return new createError.Unauthorized();
    const refreshToken = cookies.ss_refresh_token;
    return jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET ?? "",
      async (err: any, payload: any) => {

        if (err) return new createError.Unauthorized();
        const userId: string | undefined = payload.userId;
        if (!userId) {
          throw new createError.Unauthorized();
        }
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          return new createError.Unauthorized();
        }
        const userRefreshToken = await prisma.refreshToken.findUnique({
          where: { userId: userId },
          select: { refreshToken: true },
        });
  
        if (refreshToken === userRefreshToken?.refreshToken) {
          const accessToken = generateToken(userId);
          return accessToken;
        };
      }
    );
}

export const tokenService = {
  refreshToken,
}

