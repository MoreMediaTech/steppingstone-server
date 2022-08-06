import { format } from "date-fns";
import { v4 } from "uuid";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { NextFunction, Request, Response } from "express";
import { allowedOrigins } from "../config/allowedOrigins";

const uuid = v4;

const logEvents = async (message: string, logFileName: string) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "../..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "../..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "../..", "logs", logFileName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

const logger = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin as string;
  if (!allowedOrigins.includes(origin))
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();
};

export { logEvents, logger };
