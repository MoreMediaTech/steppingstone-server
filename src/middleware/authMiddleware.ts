import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { verifyAccessToken } from "../utils/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config();

interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    isAdmin: boolean;
    name: string;
    role: string;
  } | null;
}

const protect = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization || !req.cookies.ss_access_token) {
    return next(
      new createError.Unauthorized(
        "No token provided. Access token is required"
      )
    );
  }

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (req.cookies.ss_access_token) {
    token = req.cookies.ss_access_token;
  }
  if (!token) {
    return next(
      new createError.Unauthorized(
        "No token provided. Access token is required"
      )
    );
  }

  try {
    const decoded = await (<any>verifyAccessToken(token));

    req.user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        email: true,
        isAdmin: true,
        name: true,
        role: true,
        county: true,
      },
    });

    next();
  } catch (error) {
    if (error instanceof Error) {
      next(new createError.Unauthorized(error.message));
    }
    next(new createError.Unauthorized("Not Authorized"));
  }
};

const isAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    next(new createError.Unauthorized("Not authorized as an admin"));
  }
};

const restrictTo =
  (...allowedRoles: string[]) =>
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = req?.user;
    if (user && allowedRoles.includes(user.role)) {
      next();
    } else {
      return next(
        new createError.Unauthorized(
          "You are not allowed to perform this action"
        )
      );
    }
  };

export { protect, isAdmin, restrictTo };
