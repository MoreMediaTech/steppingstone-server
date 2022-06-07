import { Response } from "express";
import createError from "http-errors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import sgMail from "@sendgrid/mail";
import { IEmailFormData } from './../../types.d';

dotenv.config();

// initalise prisma client
const prisma = new PrismaClient();
// set default sendgrid api key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ?? "";
// initialise sendgrid
sgMail.setApiKey(SENDGRID_API_KEY);


/**
 * @description This function is used to send email
 * @param msg 
 * @param company 
 * @returns  a message to user confirming email has been sent
 */
const sendMail = async (msg: IEmailFormData, company: any) => {
    try {
        await sgMail.send(msg);
        await prisma.message.create({
            data: {
                from: msg.from,
                to: msg.to,
                company: company as string,
                subject: msg.subject,
                html: msg.html,
            }
        });
        return { message: "Message sent successfully" };
    } catch (error) {
        return new createError.BadRequest("Unable to send mail");
    }
}

/**
 * @description This function is used to get all messages
 * @returns  array of messages
 */
const getAllMessages = async () => {
    try {
        const messages = await prisma.message.findMany();
        return messages;
    } catch (error) {
        return new createError.BadRequest("Unable to get all messages" + error);
    }
}

/**
 * @description This function is used to get message by id
 * @param id 
 * @returns  a message
 */
const getMessageById = async (id: string) => {
    try {
        const message = await prisma.message.findUnique({
            where: {
                id
            }
        });
        return message;
    } catch (error) {
        return new createError.BadRequest("Unable to get message" + error);
    }
}

/**
 * @description This function is used to delete message by id
 * @param id 
 * @returns  a message to user confirming email has been deleted
 */
const deleteMessageById = async (id: string) => {
    try {
        await prisma.message.delete({
            where: {
                id
            }
        });
        return { message: "Message deleted successfully" };
    } catch (error) {
        return new createError.BadRequest("Unable to delete message" + error);
    }
}

export const emailServices = {
    sendMail,
    getAllMessages,
    deleteMessageById,
    getMessageById
}