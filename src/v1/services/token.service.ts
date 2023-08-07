import jwt from "jsonwebtoken";
import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { generateToken } from "../../utils/jwt";

dotenv.config();

const prisma = new PrismaClient();

const refreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  const isMobile = req
    ?.header("User-Agent")
    ?.includes("SteppingStonesApp/1.0.0");

  let refreshToken: string;

  if (!isMobile && !cookies.ss_refresh_token)
    return new createError.Forbidden("No refresh token provided");

  if (isMobile) {
    refreshToken = req.body.refreshToken || "No token Provided";
  } else {
    refreshToken = cookies.ss_refresh_token;
  }
  return jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET ?? "",
    async (err: any, payload: any) => {
      if (err instanceof jwt.TokenExpiredError) {
        await prisma.refreshToken.delete({
          where: {
            refreshToken: refreshToken,
          },
        });
        res.clearCookie("ss_refresh_token");
        return new createError.BadRequest(
          "Refresh token expired. Please log in again."
        );
      } else if (err instanceof jwt.JsonWebTokenError) {
        return new createError.Forbidden("Invalid refresh token");
      }
      const userId: string = payload.userId;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return new createError.Forbidden(
          "Invalid refresh token. User not found"
        );
      }
      const userRefreshToken = await prisma.refreshToken.findUnique({
        where: { refreshToken: refreshToken },
        select: { refreshToken: true },
      });

      if (refreshToken === userRefreshToken?.refreshToken) {
        const accessToken = generateToken(userId, "1h");
        return accessToken;
      }
    }
  );
};

export const tokenService = {
  refreshToken,
};
