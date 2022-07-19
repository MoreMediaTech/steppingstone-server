import { Request, Response } from "express";
import createError from "http-errors";
import { PrismaClient, TokenType } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { IEmailFormData, User } from "../../types";
import { generateRefreshToken, generateToken } from "../utils/jwt";
import { sendMail } from "./email.service";
import {
  resetPasswordEmailTemplate,
  resetPasswordVerificationEmailTemplate,
  verifyEmailConfirmationTemplate,
  verifyEmailTemplate,
} from "../utils/emailTemplates";
import { addHours } from "../utils/addHours";

dotenv.config();

const prisma = new PrismaClient({
  errorFormat: "pretty",
});

const dev = process.env.NODE_ENV !== "production";

export const NEXT_URL = dev
  ? "http://localhost:3001"
  : "https://steppingstonesapp.com";

interface ISendEmailResponse {
  message: string;
  success?: boolean;
}

/**
 * @description - This function is used to create a new user
 * @param data User data
 * @returns
 */
async function createUser(data: User) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    // Check if user exists
    if (existingUser && existingUser.password !== null) {
      throw new createError.BadRequest("User already exists!");
    }

    const user = await prisma.user.create({
      data: {
        email: data.email as string,
        name: data.name as string,
      },
    });
    await prisma.$disconnect();
    if (user) sendEmailVerification(user.id, user.name, user.email);
    return { message: "User created successfully" };
  } catch (error) {
    throw new createError.BadRequest("Unable to create user");
  }
}

/**
 * @description - This function is used to send an email to the user with a link to verify their email address
 * @param id User id
 * @param name
 * @param email
 * @returns
 */
export async function sendEmailVerification(
  id: string,
  name: string,
  email: string
) {
  const securedTokenId = await generateToken(id);

  const token = await prisma.token.create({
    data: {
      userId: id,
      emailToken: securedTokenId,
      type: TokenType.EMAIL,
      expiration: addHours(1),
    },
  });

  const url = `${NEXT_URL}/auth/verify-email/${securedTokenId}`;

  const subject = "Verification Email for Stepping Stones App";

  const textMSGFormat = `
            from: ${"admin@steppingstonesapp.com"}\r\n
            subject: ${subject}\r\n
            message: ${`Click to verify email address: ${url}`}
        `;

  const msg = {
    to: email, // Change to your recipient
    from: "admin@steppingstonesapp.com", // Change to your verified sender
    subject: subject,
    text: textMSGFormat, // Plain text body
    html: verifyEmailTemplate(name, url), // HTML body
  };
  if (token) {
    const response: ISendEmailResponse = await sendMail(msg, "VERIFY_EMAIL");
    return response;
  }
  return { message: "Unable to verify email" };
}

/**
 * @description - This function is used to login a user
 * @param data User data
 * @returns
 */
async function loginUser(data: User) {
  const foundUser = await prisma.user.findUnique({
    where: {
      email: data.email as string,
    },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
    },
  });

  // Check if user exists
  if (!foundUser) {
    throw new createError.NotFound("User not registered");
  }
  let checkPassword;

  // Check if password is valid
  if (foundUser && foundUser.password !== null) {
    checkPassword = bcrypt.compareSync(
      data?.password as string,
      foundUser.password
    );
  }

  if (!checkPassword)
    throw new createError.Unauthorized("Email address or password not valid");

  const accessToken = await generateToken(foundUser.id);

  const refreshToken = await generateRefreshToken(foundUser.id);

  await prisma.user.update({
    where: {
      id: foundUser.id,
    },
    data: {
      refreshTokens: {
        create: {
          refreshToken: refreshToken,
        },
      },
    },
  });

  await prisma.$disconnect();

  const user = {
    name: foundUser.name,
    email: foundUser.email,
  };
  return {
    accessToken,
    refreshToken,
    user,
  };
}

/**
 * @description - This function is used to verify a user's email address
 * @param userId User id
 * @returns
 */
const verify = async (token: string) => {
  const tokenDoc = await prisma.token.findUnique({
    where: {
      emailToken: token,
    },
  });
  if (!tokenDoc) {
    throw new createError.NotFound("Token not found");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: tokenDoc.userId,
    },
  });
  const deletedToken = await prisma.token.delete({
    where: {
      emailToken: token,
    },
  });
  await prisma.$disconnect();
  const subject = "Verification Email for Stepping Stones App";

  const textMSGFormat = `
            from: ${"admin@steppingstonesapp.com"}\r\n
            subject: ${subject}\r\n
            message: ${`Hello ${
              user?.name as string
            }, Thank you for verifying your email address`}
        `;

  const msg = {
    to: user?.email, // Change to your recipient
    from: "admin@steppingstonesapp.com", // Change to your verified sender
    subject: subject,
    text: textMSGFormat, // Plain text body
    html: verifyEmailConfirmationTemplate(user?.name as string), // HTML body
  };
  if (deletedToken) {
    await sendMail(msg as IEmailFormData, "VERIFY_EMAIL_SUCCESS");
  }
  return { success: true, message: "Email verified", userId: tokenDoc.userId };
};

/**
 * @description - This function is used to update a user
 * @param userId
 * @param emailVerified
 * @returns
 */
const updateUser = async (userId: string, emailVerified: boolean) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: emailVerified,
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "User updated" };
};

/**
 * @description - This function is used to validate a token
 * @param token
 * @returns a boolean indicating if the token is valid
 */
const validateToken = async (token: string) => {
  const tokenDoc = await prisma.token.findUnique({
    where: {
      emailToken: token,
    },
  });
  if (tokenDoc) {
    return { isValid: true };
  }
  return { isValid: false };
};

/**
 * @description - This function is used to request for a users password reset and send them an email with a link to reset their password
 * @param email
 * @returns
 */
const requestReset = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new createError.NotFound("User not found");
  }
  const token = await prisma.token.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (token) {
    await prisma.token.delete({
      where: {
        userId: user.id,
      },
    });
  }
  const securedTokenId = await generateToken(user.id);
  await prisma.token.create({
    data: {
      userId: user.id,
      emailToken: securedTokenId,
      type: TokenType.RESET_PASSWORD,
      expiration: addHours(1),
    },
  });

  const url = `${NEXT_URL}/auth/forgot-password/${securedTokenId}`;
  const name = user.name;
  const subject = "Password reset";

  const textMSGFormat = `
            from: ${"admin@steppingstonesapp.com"}\r\n
            subject: ${subject}\r\n
            message: ${`Click to reset password: ${url}`}
        `;

  const msg = {
    to: email, // Change to your recipient
    from: "admin@steppingstonesapp.com", // Change to your verified sender
    subject: subject,
    text: textMSGFormat, // Plain text body
    html: resetPasswordEmailTemplate(name, url), // HTML body
  };

  const response: ISendEmailResponse = await sendMail(msg, "RESET_PASSWORD");
  return response;
};

async function resetPassword(token: string, password: string) {
  const tokenDoc = await prisma.token.findUnique({
    where: {
      emailToken: token,
    },
  });
  if (!tokenDoc) {
    throw new createError.NotFound("Token not found");
  }
  const user = await prisma.user.update({
    where: {
      id: tokenDoc.userId,
    },
    data: {
      password: bcrypt.hashSync(password, 10),
    },
  });
  await prisma.token.delete({
    where: {
      emailToken: token,
    },
  });
  await prisma.$disconnect();
  const name = user.name;
  const subject = "Password reset successful.";

  const textMSGFormat = `
            from: ${"admin@steppingstonesapp.com"}\r\n
            subject: ${subject}\r\n
            message: ${`Password has been successfully reset.`}
        `;

  const msg = {
    to: user.email, // Change to your recipient
    from: "admin@steppingstonesapp.com", // Change to your verified sender
    subject: subject,
    text: textMSGFormat, // Plain text body
    html: resetPasswordVerificationEmailTemplate(name), // HTML body
  };
  await sendMail(msg, "RESET_PASSWORD_SUCCESS");
  return { success: true, message: "Password successfully reset" };
}

/**
 * @description - This function is used to logout a user
 * @param req
 * @param res
 * @returns
 */
async function logoutUser(req: Request, res: Response) {
  const cookies = req.cookies;
  if (!cookies.ss_refresh_token) return;
  const refreshToken: string = cookies.ss_refresh_token;
  let userId: string | undefined;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    async (err: any, payload: any) => {
      if (err) return new createError.Unauthorized();
      userId = payload.userId;
    }
  );
  await prisma.refreshToken.delete({
    where: {
      refreshToken: refreshToken,
    },
  });
  return { message: "User logged out successfully" };
}

export const authService = {
  createUser,
  loginUser,
  logoutUser,
  verify,
  updateUser,
  validateToken,
  requestReset,
  resetPassword,
};
