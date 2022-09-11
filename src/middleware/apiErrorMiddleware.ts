import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { logEvents } from "./logger";

// General error handler
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// General class for handling not found errors
export class NotFoundError extends ApiError {
  constructor(path: string) {
    super(StatusCodes.NOT_FOUND, `The requested path ${path} not found!`);
  }
}

// General class for handling all other errors
export default class ErrorHandler {
  static handle = () => {
    return async (
      err: ApiError,
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      logEvents(
        `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
        "errLog.log"
      );
      console.log("Error Stack:", err.stack);
      const statusCode = err.statusCode || 500;
      res.status(statusCode);

      res.json({
        name: err.name,
        success: false,
        isError: true,
        message: err.message,
      });
    };
  };
}
