import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { validateEmail } from "../utils/emailVerification";
import { authService } from "../services/auth.service";

const secure = process.env.NODE_ENV === "production" ? true : false;
/**
 * @description - login user
 * @route POST /api/auth/login
 * @access Public
 */
const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Check if email and password are provided
  if (!password || !email) {
    return new createError.BadRequest("Missing required fields");
  }
  // Check if email is valid
  if (!validateEmail(email)) {
    return new createError.BadRequest("Email address is not valid");
  }

  try {
    const user = await authService.loginUser(req.body);
    // res.cookie("ss_refresh_token", user.refreshToken, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60 * 24,
    //   sameSite: "none",
    //   secure: true,
    // });
    res.cookie("ss_refresh_token", user.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "none",
    });
    res.status(200).json({ user: user.user, token: user.accessToken });
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
  const { name, email, password, acceptTermsAndConditions } = req.body;

  if (!acceptTermsAndConditions) {
    return next(
      new createError.BadRequest("You must accept the terms and conditions")
    );
  }

  // Check if name, email and password are provided
  if (!name || !password || !email) {
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
    throw new createError.BadRequest("Email address already in use");
  }
};

/**
 * @description - logout/logout user - clear browser cookies
 * @route POST /api/auth/logout
 * @access Public
 */
const logout = async (req: Request, res: Response) => {
  try {
    const logoutUser = await authService.logoutUser(req, res);

    res.clearCookie("ss_refresh_token");
    res.status(204).json(logoutUser);
  } catch (error) {
    throw new createError.BadRequest("Unable to logout user");
  }
};

export { authUser, registerUser, logout };
