import { MessageType } from "@prisma/client";
import { Response } from "express";
import createError from "http-errors";
import { send } from "process";

import { IMessageData, RequestWithUser } from "../../../types";
import { messagesServices } from "../services/messages.service";
import { validateEmail } from "../../utils/emailVerification";
import { validateHuman } from "../../utils/validateHuman";

/**
 * @description This function is used to send enquiry
 * @route POST /api/v1/email/sendEnquiry
 * @access Public
 */
const sendEnquiry = async (req: RequestWithUser, res: Response) => {
  try {
    const {
      from,
      to,
      company,
      subject,
      message,
      html,
      react,
      messageType,
      token,
    }: IMessageData = req.body;

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
      to: to, // Change to your recipient
      from: from, // Change to your verified sender
      subject: subject,
      text: textMSGFormat, // Plain text body
      html: html, // HTML body
      react: react,
      message: message, // Raw message text
    };

    const sendMailResponse = await messagesServices.sendMail(
      msg,
      messageType as MessageType,
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
const sendEmail = async (req: RequestWithUser, res: Response) => {
  try {
    const {
      from,
      to,
      company,
      subject,
      message,
      html,
      messageType,
    }: IMessageData = req.body;

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
      to: to, // Change to your recipient
      from: from, // Change to your verified sender
      subject: subject,
      text: textMSGFormat, // Plain text body
      html: html, // HTML body
      message: message, // Raw message text
    };
    const sendMailResponse = await messagesServices.sendMail(
      msg,
      messageType as MessageType,
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
const getMessageById = async (req: RequestWithUser, res: Response) => {
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
const deleteMessageById = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  try {
    const deleteMailResponse = await messagesServices.deleteMessageById(id);
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
const deleteManyMessages = async (req: RequestWithUser, res: Response) => {
  const { ids } = req.body;
  try {
    const deleteMailResponse = await messagesServices.deleteManyMessages(ids);
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
const getAllInAppEnquiryMsg = async (req: RequestWithUser, res: Response) => {
  const userId = req.user?.id;
  try {
    const response = await messagesServices.getAllInAppEnquiryMsg({
      userId: userId as string,
      email: req.user?.email as string,
    });
    res.status(201).json(response);
  } catch (error) {
    return new createError.BadRequest("Unable to get all mail");
  }
};

/**
 * @description This function is used to get all messages sent by the user
 * @route GET /api/v1/messages/user
 * @access Private
 */
const getAllSentMessagesByUser = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const response = await messagesServices.getAllSentMessagesByUser({
      userId: req.user?.id as string,
      email: req.user?.email as string,
    });
    res.status(201).json(response);
  } catch (error) {
    return new createError.BadRequest("Unable to get all mail");
  }
};

/**
 * @description This function is used to get all messages sent to the user
 * @route GET /api/v1/messages/user
 * @access Private
 */
const getAllReceivedMessagesByUser = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const response = await messagesServices.getAllReceivedMessagesByUser({
      userId: req.user?.id as string,
      email: req.user?.email as string,
    });
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
const updateMsgStatusById = async (req: RequestWithUser, res: Response) => {
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
 * @description This function is used to send in app messages
 */
const sendInAppMessage = async (req: RequestWithUser, res: Response) => {
  try {
    const {
      from,
      to,
      company,
      subject,
      message,
      html,
      messageType,
    }: IMessageData = req.body;

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
      to: to, // Change to your recipient
      from: from, // Change to your verified sender
      subject: subject,
      text: textMSGFormat, // Plain text body
      html: html, // HTML body
      message: message, // Raw message text
    };
    const sendMailResponse = await messagesServices.sendInAppMessage(msg);
    res.status(201).json(sendMailResponse);
  } catch (error) {
    return new createError.BadRequest("Unable to send mail");
  }
};

export const messagesController = {
  sendEnquiry,
  deleteMessageById,
  getAllSentMessagesByUser,
  getAllInAppEnquiryMsg,
  sendEmail,
  getMessageById,
  deleteManyMessages,
  getAllReceivedMessagesByUser,
  updateMsgStatusById,
  sendInAppMessage,
};
