import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { Resend } from "resend";
import { validateEmail } from "../../utils/emailVerification";
import { authService } from "../services/auth.service";
import { validateHuman } from "../../utils/validateHuman";
import { env } from "../../utils/env";
import prisma from "../../client";
import { steppingStonesConfirmTemplate } from "../../utils/emailTemplates";
import { RequestWithUser } from "../../../types";

const resend = new Resend(env.RESEND_API_KEY);

const EMAIL_EXPIRATION_IN_MINUTES = 10;
const ACCESS_TOKEN_EXPIRATION_IN_HOURS = 12; // 7 days

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

  const isMobile = req
    ?.header("User-Agent")
    ?.includes("SteppingStonesApp/1.0.0");

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

  // Check if email is valid
  if (!validateEmail(email)) {
    return new createError.BadRequest("Email address is not valid");
  }

  // Check if email is registered
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return new createError.BadRequest("Email address is not registered");
  }

  await prisma.token.deleteMany({
    where: {
      user: {
        id: user.id,
      },
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
        type: "EMAIL",
        valid: true,
        expiration: expiration,
      },
    });

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
const authenticate = async (req: Request, res: Response) => {
  const { email, oneTimeCode, isMobile } = req.body;

  const token = await prisma.token.findUnique({
    where: {
      oneTimeCode: oneTimeCode,
    },
    include: {
      user: true,
    },
  });

  // Check if the token exists and is valid
  if (!token || !token.valid) {
    return res.status(400).json({
      status: "failed",
      message: "Unauthorized. Invalid one-time code.",
    });
  }

  // Check if the token has expired
  if (token.expiration < new Date()) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized. One-time code expired.",
    });
  }

  // Check if the user email in the token matches the email in the request body
  if (token.user.email !== email) {
    return res.sendStatus(401);
  }

  const data = {
    email: token.user.email,
    isMobile: isMobile,
    oneTimeCode: oneTimeCode,
  };

  // Check if email is valid
  try {
    const user = await authService.loginUser(data);
    res.cookie("ss_refresh_token", user.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      success: true,
      user: user.user,
      token: user.accessToken,
      refreshToken: user.refreshToken,
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
  const { name, email, acceptTermsAndConditions } = req.body;

  if (!acceptTermsAndConditions) {
    return next(
      new createError.BadRequest("You must accept the terms and conditions")
    );
  }

  // Check if name, email and password are provided
  if (!name || !email) {
    return new createError.BadRequest("Missing required fields");
  }

  // Check if email is valid
  if (!validateEmail(email)) {
    return new createError.BadRequest("Email address is not valid");
  }
  try {
    const response = await authService.createUser(req.body);
    res.status(201).json(response);
  } catch (error) {
    throw new createError.BadRequest("Unable to register user");
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
const logout = async (req: RequestWithUser, res: Response) => {
  const isMobile = req
    ?.header("User-Agent")
    ?.includes("SteppingStonesApp/1.0.0");

  try {
    if (isMobile) {
      await authService.logoutMobileUser(req, res);
      res.sendStatus(200);
    } else {
      await authService.logoutWebUser(req, res);
      res.sendStatus(200);
    }
  } catch (error) {
    console.error(error);
    if (!isMobile) {
      res.clearCookie("ss_refresh_token");
    }
    res.sendStatus(200);
  }
};

export {
  login,
  registerUser,
  verifyEmail,
  updateUser,
  validateToken,
  logout,
  authenticate,
};
