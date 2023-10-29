import { Response } from "express";
import createError from "http-errors";
import { RequestWithUser } from "../../../types";
import prisma from "../../client";
import { sendMail } from "../services/messages.service";
import { MessageType } from "@prisma/client";

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
    const newSupportLog = await prisma.supportLog.create({
      data: {
        user: { connect: { id: req.user?.id } },
        technicianId: req.body.technicianId,
        technicianName: req.body.technicianName,
        attention: req.body.attention,
        status: req.body.status,
        message: req.body.message,
        parent: {
          connect: {
            id: req.body.parentId,
          },
        },
      },
    });

    const supportMessage = {
      from: req.user?.email as string,
      to: "support@steppingstonesapp.com",
      subject: "New Support Message",
      html: `<p>${req.body.supportMessage}</p>`,
      messageType: MessageType.SUPPORTREQUEST,
      message: req.body.supportMessage,
    };

    await sendMail(supportMessage, MessageType.SUPPORTREQUEST);
    res.status(200).json({
      status: "success",
      message: "Support Message sent.",
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

  const supportLog = await prisma.supportLog.findUnique({
    where: {
      id: id,
    },
    select: {
        userId: true,
    }
  });

  if (!supportLog) return new createError.NotFound("Request not found");

 if(supportLog.userId !== req.user?.id) return new createError.Unauthorized("You are not authorized to edit this support request");

  try {
    const updatedSupportLog = await prisma.supportLog.update({
      where: {
        id: id,
      },
      data: {
        message: req.body.message,
      },
    });
    res.status(200).json({
      status: "success",
      message: "Updated support request.",
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
      message: "Support Message deleted.",
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
      message: "Support Messages deleted.",
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
