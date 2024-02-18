import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { PrismaClient, TokenType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import dotenv from "dotenv";

import { generateRefreshToken, generateToken } from "../../utils/jwt";

import {
  verifyEmailConfirmationTemplate,
  verifyEmailTemplate,
} from "../../utils/emailTemplates";
import { addHours } from "../../utils/addHours";
import { env } from "../../utils/env";
import { sendWelcomeEmail } from "../../utils/sendWelcomeMessage";
import { PartialUserSchemaProps } from "../../schema/User";

dotenv.config();

const prisma = new PrismaClient({
  errorFormat: "pretty",
});

const resend = new Resend(env.RESEND_API_KEY);

export const NEXT_URL = process.env.CLIENT_URL;

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
  const securedTokenId = await generateToken(id, "1h");

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

  if (token) {
    const response = await resend.emails.send({
      from: "email@mail.steppingstonesapp.com",
      to: email,
      subject: subject,
      html: verifyEmailTemplate(name, url),
    });

    return {
      success: true,
      message: "Email verification sent. Please check your email inbox",
      response,
    };
  } else {
    throw new createError.InternalServerError("Unable to send email");
  }
}

/**
 * @description - This function is used to create a new user
 * @param data User data
 * @returns
 */
const createUser = async (data: PartialUserSchemaProps) => {
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

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        email: data.email as string,
        name: data.name as string,
        isAdmin: false,
        postCode: data.postCode as string,
        organisation: {
          connectOrCreate: {
            where: {
              name: data.organisation as string,
            },
            create: {
              name: data.organisation as string,
            },
          },
        },
        acceptTermsAndConditions: data.acceptTermsAndConditions as boolean,
      },
    });

    const accessToken = await generateToken(newUser.id, "30d");

    await prisma.$disconnect();

    if (newUser) {
      sendWelcomeEmail(
        newUser.email,
        newUser.name,
        "Welcome to Stepping Stones"
      );
      sendEmailVerification(newUser.id, newUser.name, newUser.email);
    }
    return {
      accessToken,
      isNewlyRegistered: newUser.isNewlyRegistered,
    };
  } catch (error) {
    throw new createError.BadRequest("Unable to create user");
  }
};

/**
 * @description - This function is used to login a user
 * @param data User data
 * @returns
 */
async function authenticateUser(
  data: Pick<PartialUserSchemaProps, "email"> & {
    oneTimeCode?: string;
    isMobile?: boolean;
  }
) {
  const foundUser = await prisma.user.findUnique({
    where: {
      email: data.email as string,
    },
  });

  // Check if user exists
  if (!foundUser) {
    throw new createError.NotFound("User not registered");
  }

  // delete one time code
  if (data.oneTimeCode) {
    await prisma.token.delete({
      where: {
        oneTimeCode: data.oneTimeCode,
      },
    });
  }

  let accessToken: string;

  if (data.isMobile) {
    accessToken = await generateToken(foundUser.id, "30d");
  } else {
    accessToken = await generateToken(foundUser.id, "1d");
  }

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

  return {
    accessToken,
    refreshToken,
    user: foundUser,
  };
}

/**
 * @description - This function is used to verify a user's email address
 * @route GET /api/v1/auth/verify-email/:token
 * @access Public
 * @param token
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
  const subject = "Email verified for Stepping Stones.";

  if (deletedToken) {
    const response = await resend.emails.send({
      from: "email@mail.steppingstonesapp.com",
      to: user?.email as string,
      subject: subject,
      html: verifyEmailConfirmationTemplate(user?.name as string),
    });
  }
  return { success: true, message: "Email verified", userId: tokenDoc.userId };
};

/**
 * @description - This function is used to update a user
 * @route PUT /api/v1/users/:id
 * @access Private
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
 * @route GET /api/v1/auth/validate-token
 * @access Public
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
 * @description - This function is used to logout a user
 * @param req
 * @param res
 * @returns
 */
async function logoutWebUser(req: Request, res: Response, next: NextFunction) {
  if(!req.user) return res.sendStatus(401)
  req.logout(function (err) {
    if (err) {
      return next(err);

    }
    
  });
  return { success: true, message: "User logged out successfully" };
}

async function logoutMobileUser(req: Request, res: Response) {
  const refreshToken = req.body.refreshToken;

  // Is refreshToken in the database
  const foundToken = await prisma.refreshToken.findUnique({
    where: {
      refreshToken: refreshToken,
    },
  });

  if (!foundToken) {
    return { success: true, message: "User logged out successfully" };
  }

  await prisma.onlineUser.delete({
    where: {
      userId: foundToken.userId,
    },
  }),
    await prisma.$disconnect();
  return { success: true, message: "User logged out successfully" };
}

export const authService = {
  createUser,
  authenticateUser,
  logoutWebUser,
  logoutMobileUser,
  verify,
  updateUser,
  validateToken,
};
