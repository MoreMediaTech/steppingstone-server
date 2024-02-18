
import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { verifyAccessToken } from "../utils/jwt";
import { User } from "@prisma/client";


dotenv.config();

const protect = async (req: Request, res: Response, next: NextFunction) => {
  
  
  const isMobile = req
    ?.header("User-Agent")
    ?.includes("SteppingStonesApp/1.0.0");

  if(req.session && req.session.passport) {
    console.log('auth middleware: user is logged in')
    next();
  }
  // log the user out if there is no session

};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req?.user as User;
  if (user && user.isAdmin) {
    next();
  } else {
    next(new createError.Unauthorized("Not authorized as an admin"));
  }
};

const restrictTo =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req?.user as User;
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
