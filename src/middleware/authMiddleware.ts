import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { verifyAccessToken } from "../utils/jwt";
import { PrismaClient } from "@prisma/client";
// import { RequestWithUser } from "../../types";

const prisma = new PrismaClient();

dotenv.config();


const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return next(
      new createError.Unauthorized(
        "No token provided. Access token is required"
      )
    );
  }
  const isMobile = req
    ?.header("User-Agent")
    ?.includes("SteppingStonesApp/1.0.0");

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return next(
        new createError.Unauthorized(
          "No token provided. Access token is required"
        )
      );
    }

    const newToken = isMobile ? token : token;

    try {
      const decoded = await(<any>verifyAccessToken(newToken));
      // console.log("🚀 ~ file: authMiddleware.ts:57 ~ decoded:", decoded)

      if (!decoded)
        return next(
          new createError.Unauthorized("Invalid token. token expired")
        );

      req.user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        }
      }) as Express.User;
      // console.log("🚀 ~ file: authMiddleware.ts:57 ~ req.user", req.user)
      next();
    } catch (error) {
      if (error instanceof Error) {
        next(new createError.Unauthorized(error?.message));
      }
      next(new createError.Unauthorized("Not Authorized"));
    }
  }
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    next(new createError.Unauthorized("Not authorized as an admin"));
  }
};

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return next(
      new createError.Unauthorized(
        "You are not allowed to perform this action"
      )
    );
  }
}

const restrictTo =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req?.user;
    if (user && allowedRoles.includes(user.role as string)) {
      next();
    } else {
      return next(
        new createError.Unauthorized(
          "You are not allowed to perform this action"
        )
      );
    }
  };

export { protect, isAdmin, restrictTo, ensureAuthenticated };
