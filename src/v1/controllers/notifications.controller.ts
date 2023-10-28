import { Response } from "express";
import createError from "http-errors";
import { RequestWithUser } from "../../../types";
import prisma from "../../client";
import { sendPushNotification } from "../../utils/notifications";



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
const sendNotificationToUser = async (req: RequestWithUser, res: Response) => {
  const { title, body, type, userId } = req.body;
  
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      pushTokens: true,
      allowsPushNotifications: true,
    },
  });

  // check if user exists
  if (!user) {
    throw new createError.BadRequest(
      "User does not exist. Unable to send notification"
    );
  }

  // check if user allows push notifications
  if(!user.allowsPushNotifications) {
    throw new createError.BadRequest(
      "User does not allow push notifications. Unable to send notification"
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

/**
 * @description - send notification to all users
 * @param req 
 * @param res 
 * @returns {object} - success, message
 */
const sendNotificationToAllUsers = async (req: RequestWithUser, res: Response) => {
  const { title, body, type } = req.body;
  const users = await prisma.user.findMany({
    where: {
      allowsPushNotifications: true,
    },
    select: {
      pushTokens: true,
      id: true,
    },
  });

  if (!users) {
    throw new createError.BadRequest(
      "Users do not exist. Unable to send notification"
    );
  }

  try {
    // map through the users object and return an array of pushTokens in a single array
    const tokens = users.flatMap((user) => user.pushTokens);

    const userId = users.map((user) => user.id);
    await sendPushNotification(tokens, title, body);
    
    // create a notification for each user
    await prisma.notifications.createMany({
      data: userId.map((id) => ({
        title,
        body,
        type,
        userId: id,
      })),
    });

    res
      .status(200)
      .json({ success: true, message: "Notification sent successfully" });
  } catch (error) {
    throw new createError.BadRequest("Unable to send notification");
  }
};

/**
 * @description - mark notification as read
 * @route PUT /api/notifications/:id
 * @access Private
 * @returns {object} - success, message
 */
const markNotificationAsRead = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.notifications.update({
      where: {
        id: id,
      },
      data: {
        isRead: true,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    throw new createError.BadRequest("Unable to mark notification as read");
  }
};

export const notificationsController = {
    getNotifications,
    sendNotificationToUser,
    sendNotificationToAllUsers,
    markNotificationAsRead
}
