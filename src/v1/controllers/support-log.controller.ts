import { Response } from "express";
import createError from "http-errors";
import { RequestWithUser } from "../../../types";
import prisma from "../../client";
import { sendMail } from "../services/messages.service";

const getAllSupportLogs = async (req: RequestWithUser, res: Response) => {
  if (!req.user?.isSupportTechnician)
    return new createError.Unauthorized(
      "You are not authorized to view this resource"
    );
  try {
    const supportLogs = await prisma.supportLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({
      status: "success",
      results: supportLogs.length,
      data: {
        supportLogs,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(
      400,
      "Invalid request. Unable to get support logs. Please try again later."
    );
  }
};

const getSupportLogById = async (req: RequestWithUser, res: Response) => {
  const id = req.params.id;
  if (!req.user?.isSupportTechnician)
    return new createError.Unauthorized(
      "You are not authorized to view this resource"
    );
  try {
    const supportLog = await prisma.supportLog.findUnique({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        supportLog,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(
      400,
      "Invalid request. Unable to get support log. Please try again later."
    );
  }
};

const createSupportLog = async (req: RequestWithUser, res: Response) => {
  try {
    const supportLog = await prisma.supportLog.create({
      data: {
        userId: req.user?.id as string,
        technicianId: req.body.technicianId,
        technicianName: req.body.technicianName,
        attention: req.body.attention,
        supportMessage: req.body.supportMessage,
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        supportLog,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(
      400,
      "Invalid request. Unable to create support log. Please try again later."
    );
  }
};

const updateSupportLog = async (req: RequestWithUser, res: Response) => {
  const id = req.params.id;
  if (!req.user?.isSupportTechnician)
    return new createError.Unauthorized(
      "You are not authorized to view this resource"
    );

  const supportLog = await prisma.supportLog.findUnique({
    where: {
      id: id,
    },
  });

  if (!supportLog) return new createError.NotFound("Log does not exist");

  const updatedDescription = `${
    supportLog.supportMessage
  }\n\n[Update][${new Date().toISOString()}]: ${req.body.supportMessage}`;

  try {
    const supportLog = await prisma.supportLog.update({
      where: {
        id: id,
      },
      data: {
        supportMessage: updatedDescription,
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        supportLog,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(
      400,
      "Invalid request. Unable to update support log. Please try again later."
    );
  }
};

const deleteSupportLog = async (req: RequestWithUser, res: Response) => {
  const id = req.params.id;
  if (!req.user?.isSupportTechnician)
    return new createError.Unauthorized(
      "You are not authorized to view this resource"
    );
  try {
    const supportLog = await prisma.supportLog.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        supportLog,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(
      400,
      "Invalid request. Unable to delete support log. Please try again later."
    );
  }
};

const deleteManySupportLogs = async (req: RequestWithUser, res: Response) => {
  if (!req.user?.isSupportTechnician)
    return new createError.Unauthorized(
      "You are not authorized to view this resource"
    );
  try {
    const supportLogs = await prisma.supportLog.deleteMany({
      where: {
        id: {
          in: req.body.supportIds,
        },
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        supportLogs,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(
      400,
      "Invalid request. Unable to delete support logs. Please try again later."
    );
  }
};

export const supportLogController = {
  getAllSupportLogs,
  getSupportLogById,
  createSupportLog,
  updateSupportLog,
  deleteSupportLog,
  deleteManySupportLogs,
};
