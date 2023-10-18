import { format } from "date-fns";
import { v4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import { allowedOrigins } from "../config/allowedOrigins";
import prisma from "../client";

const uuid = v4;

const logEvents = async (message: string, path: string, statusCode: string) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    await prisma.requestErrorLog.create({
      data: {
        error: logItem,
        path,
        errorType: statusCode,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};

const logger = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin as string;
  if (!allowedOrigins.includes(origin))
    logEvents(
      `${req.method}\t${req.url}\t${req.headers.origin}`,
      `${req.path}`,
      `${req.statusCode}`
    );
  console.log(`${req.method} ${req.path}`);
  next();
};

export { logEvents, logger };
