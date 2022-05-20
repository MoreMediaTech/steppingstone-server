import jwt  from 'jsonwebtoken';
import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { generateToken} from "../utils/jwt";

dotenv.config();

const prisma = new PrismaClient();

const refreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies.ss_refresh_token) return new createError.Forbidden('No refresh token provided');
    const refreshToken = cookies.ss_refresh_token;
    console.log(refreshToken);
    return jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET ?? "",
      async (err: any, payload: any) => {

        if (err) return new createError.Forbidden('Invalid refresh token');
        const userId: string  = payload.userId;
  
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          return new createError.Forbidden('Invalid refresh token. User not found');
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

