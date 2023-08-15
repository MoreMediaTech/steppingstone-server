import { Response } from "express";
import createError from "http-errors";
import { PrismaClient, SourceDirectoryType } from "@prisma/client";
import { RequestWithUser } from "../../../types";
import { send } from "process";
import { sendPushNotification } from "../../utils/notifications";

const prisma = new PrismaClient();

/**
 * @description - get all notifications
 * @route GET /api/notifications
 * @access Private
 * @returns {object} - notifications
 */
const getNotifications = async (req: RequestWithUser, res: Response) => {
  try {
    const notifications = await prisma.notifications.findMany({
      where: {
        userId: req.user?.id,
      },
    });

    res.status(200).json(notifications);
  } catch (error) {
    throw new createError.BadRequest("Unable to get notifications");
  }
};

/**
 * @description - send notification
 * @route POST /api/notifications
 * @access Private
 * @returns {object} - success, message
 */
const sendNotification = async (req: RequestWithUser, res: Response) => {
  const { title, body, type, userId } = req.body;
  
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      pushTokens: true,
      id: true,
    },
  });

  if (!user) {
    throw new createError.BadRequest(
      "User does not exist. Unable to send notification"
    );
  }
  const token = user?.pushTokens;
  try {
    await sendPushNotification(token, title, body);
    await prisma.notifications.create({
      data: {
        title,
        body,
        type,
        userId,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Notification sent successfully" });
  } catch (error) {
    throw new createError.BadRequest("Unable to send notification");
  }
};

export const notificationsController = {
    getNotifications,
    sendNotification
}
