import { EmailType } from "@prisma/client";
import { Response } from "express";
import createError from "http-errors";

import { IEmailFormData, RequestWithUser } from "../../types";
import { emailServices } from "../services/email.service";
import { validateEmail } from "../utils/emailVerification";


/**
 * @description This function is used to send enquiry
 * @param req 
 * @param res 
 * @returns 
 */
const sendEnquiry = async (req: RequestWithUser, res: Response) => {
    try {
        const { from, to, company, subject, message, html, emailType }: IEmailFormData = req.body;
        // console.log("🚀 ~ file: email.controller.ts ~ line 17 ~ sendEnquiry ~ body", req.body)

        const textMSGFormat = `
            from: ${from}\r\n
            subject: ${subject}\r\n
            company: ${company}\r\n
            message: ${message}
        `

        const msg = {
          to: to, // Change to your recipient
          from: from, // Change to your verified sender
          subject: subject,
          text: textMSGFormat, // Plain text body
          html: html, // HTML body
        };
        // console.log("🚀 ~ file: email.controller.ts ~ line 46 ~ sendEnquiry ~ msg", msg)
        const sendMailResponse = await emailServices.sendMail(
          msg,
          emailType as EmailType,
          company
        );
        console.log('success')
        res.status(201).json(sendMailResponse);
    } catch (error) {
        return new createError.BadRequest("Unable to send mail");
        
    }
}

/**
 * @description This function is used to send email
 * @param req 
 * @param res 
 * @returns 
 */
const sendEmail = async (req: RequestWithUser, res: Response) => {
     try {
       const { from, to, company, subject, message, html, emailType }: IEmailFormData =
         req.body;

         if (
           !from ||
           !validateEmail(from) ||
           !to ||
           !validateEmail(to) ||
           !message ||
           message.trim() === ""
         ) {
           return new createError.BadRequest("Invalid email");
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
       };
       const sendMailResponse = await emailServices.sendMail(
         msg,
         emailType as EmailType,
         company
       );
       res.status(201).json(sendMailResponse);
     } catch (error) {
       return new createError.BadRequest("Unable to send mail");
     }
}

/**
 * @description This function is used to get message by id
 * @param req 
 * @param res 
 * @returns 
 */
const getMessageById = async (req: RequestWithUser, res: Response) => {
    const { id } = req.params;
    try {
        const getMessageByIdResponse = await emailServices.getMessageById(id);
        res.status(201).json(getMessageByIdResponse);
    } catch (error) {
        return new createError.BadRequest("Unable to get message");
    }
}

/**
 * @description This function is used to delete message by id
 * @param req 
 * @param res 
 * @returns 
 */
const deleteMailById = async (req: RequestWithUser, res: Response) => {
    const { id} = req.params;
    try {
        const deleteMailResponse = await emailServices.deleteMessageById(id);
        res.status(201).json(deleteMailResponse);
    } catch (error) {
        return new createError.BadRequest("Unable to delete mail");
    }
};

/**
 * @description This function is used to get all messages
 * @param req 
 * @param res 
 * @returns 
 */
const getAllMail = async (req: RequestWithUser, res: Response) => {
    try {
        const getAllMailResponse = await emailServices.getAllMessages();
        res.status(201).json(getAllMailResponse);
    } catch (error) {
        return new createError.BadRequest("Unable to get all mail");
    }
}

export { sendEnquiry, deleteMailById, getAllMail, sendEmail, getMessageById };
