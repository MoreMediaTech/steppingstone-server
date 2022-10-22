import createError from "http-errors";
import dotenv from "dotenv";
import { EmailType, PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { IEmailFormData } from "./../../types.d";

dotenv.config();

// initalise prisma client
const prisma = new PrismaClient();

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "zoho", // true for 465, false for other ports
  auth: {
    user: process.env.USER_EMAIL, // generated user
    pass: process.env.USER_PASSWORD, // generated password
  },
});

/**
 * @description This function is used to send email
 * @param msg
 * @param company
 * @returns  a message to user confirming email has been sent
 */
export const sendMail = async (
  msg: IEmailFormData,
  emailType: EmailType,
  company?: any
) => {
  // Setup email data with unicode symbols
  const mailOptions = {
    from: "admin@steppingstonesapp.com", // sender address
    to: msg.to, // list of receivers
    subject: `From: ${msg.from} - ${msg.subject}`, // Subject line
    text: msg.text, // plain text body
    html: msg.html, // html body
  };

  try {
    // send mail with defined transport object
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return error;
      }
      return `Message Sent successfully: ${info.response}`;
    });
    await prisma.message.create({
      data: {
        from: msg.from,
        to: msg.to,
        company: company as string,
        subject: msg.subject,
        html: msg.html,
        emailType: emailType,
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
const sendInAppMessage = async (msg: IEmailFormData) => {
    await prisma.message.create({
      data: {
        from: msg.from,
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
        emailType: EmailType.IN_APP,
        message: msg?.message as string,
        user: { connect: { email: msg.from } },
      },
    });
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
const updateMailById = async (id: string, isRead: boolean, isArchived: boolean) => {
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
}

/**
 * @description This function is used to get all messages
 * @returns  array of messages
 */
const getAllMessages = async () => {
  const messages = prisma.message.findMany({ where: { emailType: EmailType.ENQUIRY }, orderBy: { createdAt: "desc" } });

  return messages;
};

/**
 * @description This function gets all messages by user email
 * @param email
 * @returns  array of messages
 */
const getAllMailByUserEmail = async (email: string) => {
  const messages = await prisma.message.findMany({
    where: {
      to: email,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return messages;
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

export const emailServices = {
  sendMail,
  getAllMessages,
  deleteMessageById,
  getMessageById,
  deleteManyMessages,
  getAllMailByUserEmail,
  updateMailById,
  sendInAppMessage,
};
