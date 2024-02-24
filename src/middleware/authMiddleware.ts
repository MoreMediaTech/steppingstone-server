import createError from "http-errors";
import e, { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import { verifyAccessToken } from "../utils/jwt";
import prisma from "../client";

export async function protect(req: Request, res: Response, next: NextFunction) {
  const tokenParts = req.headers.authorization?.split(" ");

  if (
    tokenParts![0] === "Bearer" &&
    tokenParts![1].match(/\S+\.\S+\.\S+/) !== null
  ) {
    const token = tokenParts![1];
    try {
      const decoded = await (<any>verifyAccessToken(token));

      if (!decoded)
        return next(
          new createError.Unauthorized("Invalid token. token expired")
        );

      req.user = (await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
      })) as Express.User;

      next();
    } catch (error) {
      if (error instanceof Error) {
        next(new createError.Unauthorized(error?.message));
      }
      next(
        new createError.Unauthorized(
          "You are not authorized to access this route"
        )
      );
    }
  } else {
    next(
      new createError.Unauthorized(
        "You are not authorized to access this route"
      )
    );
  }
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req?.user as User;
  if (user && user.isAdmin) {
    next();
  } else {
    next(new createError.Unauthorized("Not authorized as an admin"));
  }
}

export const restrictTo =
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
