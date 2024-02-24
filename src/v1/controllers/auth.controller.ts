import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { Resend } from "resend";
import { uuid } from "uuidv4";
import { validateEmail } from "../../utils/emailVerification";
import { authService } from "../services/auth.service";
import { validateHuman } from "../../utils/validateHuman";
import { env } from "../../utils/env";
import prisma from "../../client";
import { steppingStonesConfirmTemplate } from "../../utils/emailTemplates";
import { TokenType } from "@prisma/client";

const resend = new Resend(env.RESEND_API_KEY);

const EMAIL_EXPIRATION_IN_MINUTES = 10;

const generateOneTimeCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * @description - login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req: Request, res: Response) => {
  const { email, token } = req.body;
  console.log("🚀 ~ login ~ email, token:", email, token)

  const isMobile = req
  ?.header("User-Agent")
  ?.includes("SteppingStonesApp/1.0.0");
  console.log("🚀 ~ login ~ isMobile:", isMobile)

  let isHuman;

  if (!isMobile) {
    // validate recaptcha to token and confirm is human
    isHuman = await validateHuman(token as string);

    // if not human, return error
    if (!isHuman) {
      return new createError.BadRequest(
        "You are not human. We can't be fooled."
      );
    }
  }

  // Check if email is registered
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  console.log("🚀 ~ login ~ user:", user)

  if (!user && user === null) {
    return new createError.BadRequest("Email address is not registered");
  }
  console.log("🚀 ~ login ~ user: user exist")
  await prisma.token.deleteMany({
    where: {
      userId: user.id,
      type: TokenType.ONE_TIME_CODE,
    },
  });

  const oneTimeCode = generateOneTimeCode(); // Generate a random 6-digit code
  const expiration = new Date(
    new Date().getTime() + EMAIL_EXPIRATION_IN_MINUTES * 60 * 1000
  ); // Set the expiration time to 10 minutes from now

  try {
    await prisma.token.create({
      data: {
        oneTimeCode: oneTimeCode,
        user: {
          connect: {
            id: user.id,
          },
        },
        type: TokenType.ONE_TIME_CODE,
        valid: true,
        expiration: expiration,
      },
    });
    console.log("🚀 ~ login ~ oneTimeCode: generated")
    await prisma.$disconnect();

    await resend.emails.send({
      from: "email@mail.steppingstonesapp.com",
      to: email,
      subject: "Verify your email address",
      html: steppingStonesConfirmTemplate(oneTimeCode),
    });

    res.status(200).json({
      status: "success",
      message: "One-time code sent. Please check your email.",
    });
  } catch (error) {
    throw new createError.Unauthorized(
      "Unable to login user. Please try again later."
    );
  }
};

/**
 * @description - authenticate user, verify one-time code, and return access token
 * @route POST /api/auth/authenticate
 * @returns  {object} - user object
 */
const authenticate = (req: Request, res: Response) => {
  try {
    const loggedInUser = {
      name: req.user?.name,
      email: req.user?.email,
      isAdmin: req.user?.isAdmin,
    };
    res.status(200).json({
      success: true,
      user: loggedInUser,
    });
  } catch (error) {
    throw new createError.Unauthorized("Unable to login user");
  }
};

/**
 * @description - authenticate a mobile user, verify one-time code, and return access token
 * @route POST /api/auth/mobile/authenticate
 * @returns  {object} - user object
 */
const authenticateMobileUser = async (req: Request, res: Response) => {
  const { email, oneTimeCode } = req.body;
  console.log("🚀 ~ authenticateMobileUser ~ email, oneTimeCode:", email, oneTimeCode)
  try {
    const data = {
      email,
      oneTimeCode,
      isMobile: true,
    };
    const user = await authService.authenticateUser(data);
    res.status(200).json({
      success: true,
      token: user.token,
      user: user.user,
    });
  } catch (error) {
    throw new createError.Unauthorized("Unable to login user");
  }
};

/**
 * @description - register/create a user
 * @route POST /api/auth/register
 * @access Public
 */
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { acceptTermsAndConditions } = req.body;

  if (!acceptTermsAndConditions) {
    return next(
      new createError.BadRequest("You must accept the terms and conditions")
    );
  }

  try {
    const response = await authService.createUser(req.body);
    res.status(201).json({
      success: true,
      token: response.token,
      isNewlyRegistered: response.isNewlyRegistered,
      expiresIn: response.expiresIn,
    });
  } catch (error) {
    next(new createError.BadRequest("Unable to register user"));
  }
};

/**
 * @description - verify email address
 * @route POST /api/auth/verify-email
 * @access Public
 */
const verifyEmail = async (req: Request, res: Response) => {
  try {
    if (req.body.type === "EMAIL") {
      const deletedToken = await authService.verify(req.body.token);
      res.status(200).json({ ...deletedToken });
    } else {
      res.status(400).json({ success: false, message: "Invalid request" });
    }
  } catch (error) {
    throw new createError.BadRequest("Unable to verify email address");
  }
};

/**
 * @description - validate user email request token
 * @param req
 * @param res
 */
const validateToken = async (req: Request, res: Response) => {
  try {
    const validToken = await authService.validateToken(req.body?.token);

    res.status(204).json({ ...validToken });
  } catch (error) {
    throw new createError.BadRequest("Unable to validate token");
  }
};

/**
 * @description - update user
 * @param req
 * @param res
 */
const updateUser = async (req: Request, res: Response) => {
  const { userId, emailVerified } = req.body;
  try {
    const updatedUser = await authService.updateUser(userId, emailVerified);

    res.status(200).json(updatedUser);
  } catch (error) {
    throw new createError.BadRequest("Unable to update user");
  }
};

/**
 * @description - logout user - clear browser cookies
 * @route POST /api/auth/logout
 * @access Public
 */
const logout = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.sendStatus(401);

  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function (err) {});
    res.sendStatus(204);
  });
};

export const authController = {
  login,
  registerUser,
  verifyEmail,
  updateUser,
  validateToken,
  logout,
  authenticate,
  authenticateMobileUser,
};
