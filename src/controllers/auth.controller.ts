import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import { validateEmail } from "../utils/emailVerification";
import { createUser, loginUser } from "../services/auth.service";

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
    const user = await loginUser(req.body);
    // Generate token
    const accessToken = generateToken(user.id);

    // res.cookie("ss_access_token", accessToken, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: process.env.NODE_ENV === "production",
    //     maxAge: 1000 * 60 * 60 * 24 * 7,
    //   }).status(200).json({
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    //   isAdmin: user.isAdmin,
    //   role: user.role,
    //   county: user.county,
    //   token: accessToken,
    // });
    res.status(200).json({ ...user, token: accessToken });
  } catch (error) {
    throw new createError.Unauthorized("Email address or password not valid");
  }
};

/**
 * @description - register/create a user
 * @route POST /api/auth/register
 * @access Public
 */
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, county, acceptTermsAndConditions } = req.body;

  if (!acceptTermsAndConditions) {
    return next(new createError.BadRequest("You must accept the terms and conditions"));
      
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
    const user = await createUser(req.body);
    const accessToken = generateToken(user.id);

    // res
    //   .cookie("ss_access_token", accessToken, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: process.env.NODE_ENV === "production",
    //     maxAge: 1000 * 60 * 60 * 24 * 7,
    //   })
    //   .status(201)
    //   .json({ ...user, token: accessToken });
    res.status(201).json({ ...user, token: accessToken });
  } catch (error) {
    throw new createError.BadRequest("Email address already in use");
  }
};

/**
 * @description - logout/logout user - clear browser cookies
 * @route POST /api/auth/logout
 * @access Public
 */
const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("ss_access_token").status(200).json({
    message: "User logged out",
  });
};


export { authUser, registerUser, logoutUser };