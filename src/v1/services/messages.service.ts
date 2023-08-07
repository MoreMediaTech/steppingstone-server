import createError from "http-errors";
import dotenv from "dotenv";
import { MessageType, PrismaClient } from "@prisma/client";
import { IMessageData } from "../../../types";
import { Resend } from "resend";
import { env } from "../../utils/env";

dotenv.config();

// initalise prisma client
const prisma = new PrismaClient();

// initialise resend
const resend = new Resend(env.RESEND_API_KEY);

/**
 * @description This function is used to send email
 * @param msg
 * @param company
 * @returns  a message to user confirming email has been sent
 */
export const sendMail = async (
  msg: IMessageData,
  messageType: MessageType,
  company?: any
) => {
  try {
    // send mail with defined transport object
    await resend.emails.send({
      from: "email@mail.steppingstonesapp.com",
      to: msg.to,
      subject: `From: ${msg.from} - ${msg.subject}`,
      html: msg.html,
    });
    await prisma.message.create({
      data: {
        from: msg.from,
        to: msg.to,
        company: company as string,
        subject: msg.subject,
        html: msg.html,
        messageType: messageType,
        message: msg?.message as string,
      },
    });
    return {
      message: `Message Sent successfully`,
      success: true,
    };
  } catch (error) {
    return new createError.BadRequest("Unable to send mail");
  }
};

/**
 * @description This function is used to send email
 * @param msg
 * @returns  a message to user confirming email has been sent
 */
const sendInAppMessage = async (msg: IMessageData) => {
  // create a message from the sender and create a message from the receiver
  await prisma.$transaction([
    prisma.message.create({
      data: {
        from: msg.from,
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
        messageType: MessageType.IN_APP,
        message: msg?.message as string,
        user: { connect: { email: msg.from } },
      },
    }),
    prisma.message.create({
      data: {
        from: msg.from,
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
        messageType: MessageType.IN_APP,
        message: msg?.message as string,
        user: { connect: { email: msg.to } },
      },
    }),
  ]);

  return {
    message: `Message Sent successfully`,
    success: true,
  };
};

/**
 * @description This function is used to send email
 * @param id
 * @param isRead
 * @param isArchived
 * @returns  a message to user confirming email has been updated
 */
const updateMsgStatusById = async (
  id: string,
  isRead: boolean,
  isArchived: boolean
) => {
  await prisma.message.update({
    where: {
      id,
    },
    data: {
      isRead: isRead,
      isArchived: isArchived,
    },
  });
  return { message: "Message updated successfully", success: true };
};

/**
 * @description This function is used to get all enquiry and IN_App messages sent to the admin
 * @returns  array of messages
 */
const getAllInAppEnquiryMsg = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  const enquiryMsg = await prisma.message.findMany({
    where: { messageType: MessageType.ENQUIRY },
    orderBy: { createdAt: "desc" },
  });
  const inAppUsersToEditorMsg = await prisma.message.findMany({
    where: { messageType: MessageType.IN_APP, user: { id: userId }, to: email },
    orderBy: { createdAt: "desc" },
  });

  const messages = [...enquiryMsg, ...inAppUsersToEditorMsg];
  return messages;
};

/**
 * @description This function gets all received messages by user email
 * @param email
 * @returns  array of messages
 */
const getAllReceivedMessagesByUser = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  const receivedMsg = await prisma.message.findMany({
    where: {
      to: email,
      user: { id: userId },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return receivedMsg;
};

/**
 * @description This function gets all sent messages by user email
 * @param email
 * @returns  array of messages
 */
const getAllSentMessagesByUser = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  const sentMsg = await prisma.message.findMany({
    where: {
      from: email,
      user: { id: userId },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return sentMsg;
};

/**
 * @description This function is used to get message by id
 * @param id
 * @returns  a message
 */
const getMessageById = async (id: string) => {
  const message = await prisma.message.findUnique({
    where: {
      id,
    },
  });
  return message;
};

/**
 * @description This function is used to delete message by id
 * @param id
 * @returns  a message to user confirming email has been deleted
 */
const deleteMessageById = async (id: string) => {
  await prisma.message.delete({
    where: {
      id,
    },
  });
  return { message: "Message deleted successfully", success: true };
};
/**
 * @description This function is used to delete message by id
 * @param id
 * @returns  a message to user confirming email has been deleted
 */
const deleteManyMessages = async (ids: string[]) => {
  await prisma.message.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  return { message: "Message deleted successfully", success: true };
};

export const messagesServices = {
  sendMail,
  getAllInAppEnquiryMsg,
  deleteMessageById,
  getMessageById,
  deleteManyMessages,
  getAllReceivedMessagesByUser,
  updateMsgStatusById,
  sendInAppMessage,
  getAllSentMessagesByUser,
};
