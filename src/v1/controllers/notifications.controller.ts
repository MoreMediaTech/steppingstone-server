import { Request, Response } from "express";
import createError from "http-errors";
import prisma from "../../client";
import { sendPushNotification } from "../../utils/notifications";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";

/**
 * @description - get all notifications
 * @route GET /api/notifications
 * @access Private
 * @returns  notifications
 */
const getNotifications = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const notifications = await prisma.notifications.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
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
const sendNotificationToUser = async (req: Request, res: Response) => {
  const { title, body, type, url = "/feed", userId } = req.body;

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
  if (!user.allowsPushNotifications) {
    throw new createError.BadRequest(
      "User does not allow push notifications. Unable to send notification"
    );
  }

  const token = user?.pushTokens;
  const data = {
    title,
    body,
    url,
  };
  try {
    await sendPushNotification(token, title, body, data);
    await prisma.notifications.create({
      data: {
        title,
        body,
        type,
        user: {
          connect: {
            id: userId,
          },
        },
        authorId: req.user?.id as string,
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
 * @route POST /api/notifications/all
 * @access Private
 * @returns {object} - success, message
 */
const sendNotificationToAllUsers = async (req: Request, res: Response) => {
  const { title, body, url, type } = req.body;

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

    // map through the users object and return an array of user ids in a single array
    const userId = users.map((user) => user.id);

    // send push notification to all users
    const data = {
      title,
      body,
      url,
    };
    await sendPushNotification(tokens, title, body, data);

    // create a notification for each user
    await prisma.notifications.createMany({
      data: userId.map((id) => ({
        title,
        body,
        type,
        userId: id,
        authorId: req.user?.id as string,
      })),
    });

    res
      .status(200)
      .json({ success: true, message: "Notification sent successfully" });
  } catch (error: any) {
    if (error instanceof PrismaClientUnknownRequestError) {
      throw new createError.BadRequest(error.message);
    }
    throw new createError.BadRequest(
      error.message || "Unable to send notification"
    );
  }
};

/**
 * @description - get notification by id
 * @route PUT /api/notifications/:id
 * @access Private
 * @returns {object} - success, message
 */
const getNotificationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const notification = await prisma.notifications.findUnique({
      where: {
        id: id,
      },
    });

    res.status(200).json(notification);
  } catch (error) {
    throw new createError.BadRequest("Unable to get notification");
  }
};

/**
 * @description - mark all notifications as read
 * @route PUT /api/notifications
 * @access Private
 * @returns {object} - success, message
 */
const markAllNotificationAsRead = async (req: Request, res: Response) => {
  const { ids } = req.body;

  try {
    await prisma.notifications.updateMany({
      where: {
        id: {
          in: ids,
        },
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

/**
 * @description - mark notification as read
 * @route PUT /api/notifications/archive
 * @access Private
 * @returns {object} - success, message
 * */
const archiveAllNotifications = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { ids } = req.body;

  try {
    await prisma.notifications.updateMany({
      where: {
        userId: userId,
        id: {
          in: ids,
        },
      },
      data: {
        isArchived: true,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "All notifications archived" });
  } catch (error) {
    throw new createError.BadRequest("Unable to archive notifications");
  }
};

/**
 * @description - mark notification as read
 * @route PUT /api/notifications/:id
 * @access Private
 * @returns {object} - success, message
 */
const markNotificationAsRead = async (req: Request, res: Response) => {
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
  archiveAllNotifications,
  getNotifications,
  getNotificationById,
  sendNotificationToUser,
  sendNotificationToAllUsers,
  markNotificationAsRead,
  markAllNotificationAsRead,
};

