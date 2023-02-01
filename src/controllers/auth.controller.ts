import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { validateEmail } from "../utils/emailVerification";
import { authService } from "../services/auth.service";
import { validateHuman } from "../utils/validateHuman";

/**
 * @description - login user
 * @route POST /api/auth/login
 * @access Public
 */
const authUser = async (req: Request, res: Response) => {
  const { email, password, token } = req.body;

  const isMobile = req
  ?.header("User-Agent")
  ?.includes("SteppingStonesApp/1.0.0");
  
  let isHuman
  
  if(!isMobile) {
    // validate recaptcha to token and confirm is human
    isHuman = await validateHuman(token as string);
    
    // if not human, return error
    if (!isHuman) {
      return new createError.BadRequest("You are not human. We can't be fooled.");
    }
  }
  
  // Check if email and password are provided
  if (!password || !email) {
    return new createError.BadRequest("Missing required fields");
  }

  // Check if email is valid
  if (!validateEmail(email)) {
    return new createError.BadRequest("Email address is not valid");
  }

  const data = {
    email,
    password,
    isMobile,
  };
  
  try {
    const user = await authService.loginUser(data);
    res.cookie("ss_refresh_token", user.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "none",
      secure: true,
    });
    res
      .status(200)
      .json({
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
  const { name, email, password, acceptTermsAndConditions } = req.body

  if (!acceptTermsAndConditions) {
    return next(
      new createError.BadRequest("You must accept the terms and conditions")
    );
  }

  // Check if name, email and password are provided
  if (!name || !password || !email) {
    return new createError.BadRequest("Missing required fields")
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
 * @description - reset user password
 * @route POST /api/auth/reset-password
 * @access Public
 */
const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!password) throw new createError.BadRequest("Missing required fields");
  try {
    const response = await authService.resetPassword(token, password);

    res.status(204).json(response);
  } catch (error) {
    throw new createError.BadRequest("Unable to reset password");
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
 * @description - request a new password reset
 * @param req
 * @param res
 */
const requestReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!validateEmail(email))
    throw new createError.BadRequest("Email address is not valid");
  try {
    const response = await authService.requestReset(email);

    res.status(204).json(response);
  } catch (error) {
    throw new createError.BadRequest("Unable to request reset");
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
const logout = async (req: Request, res: Response) => {
  await authService.logoutUser(req, res);

  res.clearCookie("ss_refresh_token");
  res.sendStatus(204);
};

export {
  authUser,
  registerUser,
  verifyEmail,
  updateUser,
  validateToken,
  requestReset,
  logout,
  resetPassword,
};
