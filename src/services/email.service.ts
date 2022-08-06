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

  // verify connection configuration
  // transporter.verify(function (error, success) {
  //   if (error) {
  //     return error;
  //   } else {
  //     console.log(success);
  //     return "Server is ready to take our messages";
  //   }
  // })
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
    console.log(error);
    return new createError.BadRequest("Unable to send mail");
  }
};

/**
 * @description This function is used to get all messages
 * @returns  array of messages
 */
const getAllMessages = async () => {
  console.log("processing");
  const messages = prisma.message.findMany({ orderBy: { createdAt: "desc" } });

  return messages;
};

/**
 * @description This function is used to get message by id
 * @param id
 * @returns  a message
 */
const getMessageById = async (id: string) => {
  try {
    const message = await prisma.message.findUnique({
      where: {
        id,
      },
    });
    return message;
  } catch (error) {
    return new createError.BadRequest("Unable to get message" + error);
  }
};

/**
 * @description This function is used to delete message by id
 * @param id
 * @returns  a message to user confirming email has been deleted
 */
const deleteMessageById = async (id: string) => {
  try {
    await prisma.message.delete({
      where: {
        id,
      },
    });
    return { message: "Message deleted successfully", success: true };
  } catch (error) {
    return new createError.BadRequest("Unable to delete message" + error);
  }
};

export const emailServices = {
  sendMail,
  getAllMessages,
  deleteMessageById,
  getMessageById,
};
