import { MessageType } from "@prisma/client";
import {Request, Response } from "express";
import createError from "http-errors";
import { send } from "process";


import { messagesServices } from "../services/messages.service";
import { validateEmail } from "../../utils/emailVerification";
import { validateHuman } from "../../utils/validateHuman";
import { PartialMessageSchemaProps } from "../../schema/Messages";
import prisma from "../../client";

/**
 * @description This function is used to send enquiry
 * @route POST /api/v1/email/sendEnquiry
 * @access Public
 */
const sendEnquiry = async (req: Request, res: Response) => {
  try {
    const {
      name,
      from,
      to,
      company,
      subject,
      message,
      html,
      react,
      messageType,
      token,
    }: PartialMessageSchemaProps & { name: string; token: string } = req.body;

    const isHuman = await validateHuman(token as string);
    if (!isHuman) {
      return new createError.BadRequest(
        "You are not human. We can't be fooled."
      );
    }

    const textMSGFormat = `
            from: ${from}\r\n
            subject: ${subject}\r\n
            company: ${company}\r\n
            message: ${message}
        `;

    const msg = {
      name: name, // name of sender
      to: to, // Change to your recipient
      from: from, // Change to your verified sender
      subject: subject,
      text: textMSGFormat, // Plain text body
      html: html, // HTML body
      react: react,
      message: message, // Raw message text
    };

    const folderName = "Enquiries";

    const sendMailResponse = await messagesServices.sendMail(
      msg,
      messageType as MessageType,
      folderName,
      company
    );
    res.status(201).json(sendMailResponse);
  } catch (error) {
    return new createError.BadRequest("Unable to send mail");
  }
};

/**
 * @description This function is used to send email
 * @route POST /api/v1/email/sendEmail
 * @access Public
 */
const sendEmail = async (req: Request, res: Response) => {
  try {
    const {
      name,
      from,
      to,
      company,
      subject,
      message,
      html,
      messageType,
    }: PartialMessageSchemaProps & { name: string} = req.body;

    if (
      !from ||
      !validateEmail(from) ||
      !to ||
      !validateEmail(to) ||
      !message ||
      message.trim() === ""
    ) {
      return new createError.BadRequest(
        "Required fields are missing. Please try again."
      );
    }

    const textMSGFormat = `
            from: ${from}\r\n
            subject: ${subject}\r\n
            company: ${company}\r\n
            message: ${message}
        `;

    const msg = {
      name: name, // name of sender
      to: to, // Change to your recipient
      from: from, // Change to your verified sender
      subject: subject,
      text: textMSGFormat, // Plain text body
      html: html, // HTML body
      message: message, // Raw message text
    };

    const folderName = "Sent";
    const sendMailResponse = await messagesServices.sendMail(
      msg,
      messageType as MessageType,
      folderName as string,
      company
    );
    res.status(201).json(sendMailResponse);
  } catch (error) {
    return new createError.BadRequest("Unable to send mail");
  }
};

/**
 * @description This function is used to get message by id
 * @route GET /api/v1/email/:id
 * @access Private
 */
const getMessageById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const getMessageByIdResponse = await messagesServices.getMessageById(id);
    res.status(201).json(getMessageByIdResponse);
  } catch (error) {
    return new createError.BadRequest("Unable to get message");
  }
};

/**
 * @description This function is used to delete message by id
 * @route DELETE /api/v1/email/:id
 * @access Private
 */
const deleteMessageById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { folderName } = req.body;
  try {
    const deleteMailResponse = await messagesServices.deleteMessageById(
      folderName,
      id
    );
    res.status(201).json(deleteMailResponse);
  } catch (error) {
    return new createError.BadRequest("Unable to delete mail");
  }
};

/**
 * @description This function is used to delete many messages
 * @route DELETE /api/v1/email/deleteMany
 * @access Private
 */
const deleteManyMessages = async (req: Request, res: Response) => {
  const { folderName, ids } = req.body;
  try {
    const deleteMailResponse = await messagesServices.deleteManyMessages(
      folderName,
      ids
    );
    res.status(201).json(deleteMailResponse);
  } catch (error) {
    return new createError.BadRequest("Unable to delete mail");
  }
};

/**
 * @description This function is used to get all messages sent to an editor including in_app messages
 * @route GET /api/v1/email
 * @access Private Admin SS_EDITOR
 */
const getFoldersWithMessagesCount = async (
  req: Request,
  res: Response
) => {
  // console.log("getFoldersWithMessagesCount function called")
  try {
    const response = await messagesServices.getFoldersWithMessagesCount();
    res.status(201).json(response);
  } catch (error) {
    return new createError.BadRequest("Unable to get message count");
  }
};

/**
 * @description This function is used to get all messages for a folder 'Sent', 'Inbox', 'Archived'
 * @route POST /api/v1/messages/folder
 * @access Private
 */
const getMessagesForFolder = async (req: Request, res: Response) => {
  const { folderName } = req.body;
  try {
    const response = await messagesServices.getMessagesForFolder(folderName);
    res.status(201).json(response);
  } catch (error) {
    return new createError.BadRequest("Unable to get all mail");
  }
};


/**
 * @description This function is used to get a message in a folder 'Sent', 'Inbox', 'Archived' by id
 * @route POST /api/v1/messages/folder/:id
 * @access Private
 */
const getMessageInFolder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { folderName } = req.body;
  try {
    const response = await messagesServices.getMessageInFolder(folderName, id);
    res.status(201).json(response);
  } catch (error) {
    return new createError.BadRequest("Unable to get all mail");
  }
};

/**
 * @description This function is used to update message by id
 * @route PUT /api/v1/email/:id
 * @access Private
 */
const updateMsgStatusById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isRead, isArchived } = req.body;
  try {
    const updateMailResponse = await messagesServices.updateMsgStatusById(
      id,
      isRead,
      isArchived
    );
    res.status(201).json(updateMailResponse);
  } catch (error) {
    return new createError.BadRequest("Unable to update mail");
  }
};

/**
 * @description This function is used to create a folder
 * @route POST /api/v1/messages/create-folder
 * @access Private
 */
const createFolder = async (req: Request, res: Response) => {
  try {
    const { folderName } = req.body;
    const newFolder = await prisma.folder.create({
      data: {
        name: folderName,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Folder created successfully",
      folderId: newFolder.id,
    });
  } catch (error) {
    return new createError.BadRequest("Unable to create folder");
  }
};

/**
 * @description This function is used to create a user folder
 * @route POST /api/v1/messages/create-user-folder
 * @returns 
 */
const createUserFolder = async (req: Request, res: Response) => {
  try {
    const { folderId, userId } = req.body;
    await prisma.userFolder.create({
      data: {
        folder: {
          connect: { id: folderId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });

    res.status(201).json({
      status: "success",
      message: "User folder created successfully",
    });
  } catch (error) {
    return new createError.BadRequest("Unable to create folder");
  }
};

const createEnquiryFolder = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.body;

    const adminUsers = await prisma.user.findMany({
      where: {
        isAdmin: true,
      },
      select: {
        id: true,
      }
    });

    await Promise.all(adminUsers.map(async (user) => {
      await prisma.userFolder.create({
        data: {
          folder: {
            connect: { id: folderId },
          },
          user: {
            connect: { id: user.id },
          },
        },
      });
    }))

    res.status(201).json({
      status: "success",
      message: "User folder created successfully",
    });
  } catch (error) {
    return new createError.BadRequest("Unable to create folder");
  }
};

export const messagesController = {
  sendEnquiry,
  deleteMessageById,
  getMessagesForFolder,
  getFoldersWithMessagesCount,
  sendEmail,
  getMessageById,
  deleteManyMessages,
  getMessageInFolder,
  updateMsgStatusById,
  createFolder,
  createUserFolder,
  createEnquiryFolder,
};
