import { RequestWithUser } from './../../types.d';
import createError from "http-errors";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { validateEmail } from "../utils/emailVerification";


const prisma = new PrismaClient();

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
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        isAdmin: true,
        name: true,
        role: true,
        county: true,
        password: true,
      },
    });

    // Check if user exists
    if (!user) {
      throw new createError.NotFound("User not registered");
    }
    let checkPassword;

    // Check if password is valid
    if (user && user.password !== null) {
      checkPassword = bcrypt.compareSync(password, user.password);
    }

    if (!checkPassword)
      throw new createError.Unauthorized("Email address or password not valid");

      // Generate token
    const accessToken = generateToken(user.id);
    res.cookie("ss_access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      }).status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
      county: user.county,
      token: accessToken,
    });
  } catch (error) {
    throw new createError.Unauthorized("Email address or password not valid");
  }
};

/**
 * @description - register/create a user
 * @route POST /api/auth/register
 * @access Public
 */
const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, county } = req.body;

  // Check if name, email and password are provided
  if (!name || !password || !email) {
    return new createError.BadRequest("Missing required fields");
  }

  // Check if email is valid
  if (!validateEmail(email)) {
    return new createError.BadRequest("Email address is not valid");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // Check if user exists
  if (user && user.password !== null) {
    throw new createError.BadRequest("User already exists");
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, 10),
        name,
        county
      },
      select: {
        id: true,
        email: true,
        isAdmin: true,
        name: true,
        county: true,
        role: true,
      },
    });
    const accessToken = generateToken(user.id);
    res
      .cookie("ss_access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .status(201)
      .json({ ...user, token: accessToken });
  } catch (error) {
    throw new createError.BadRequest("Email address already in use");
  }
};

/**
 * @description - update user profile
 * @route PUT /api/auth/:id
 * @access Private
 */
const updateUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, county, role } = req.body;
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      email,
      password,
      county,
      role,
    },
  });
  res.status(200).json(user);
};

/**
 * @description - Get users data
 * @route GET /api/users
 * @access Private
 */
const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      isAdmin: true,
      name: true,
      role: true,
      county: true,
    },
  });
  res.status(200).json(users);
};

/**
 * @description - delete user
 * @route DELETE /api/users/:id
 * @access Private
 */
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });
  res.status(200).json(user);
};

/**
 * @description - Get user data
 * @route GET /api/users/:id
 * @access Private/admin
 */
const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      isAdmin: true,
      name: true,
      role: true,
      county: true,
    },
  });
  res.status(200).json(user);
};
/**
 * @description - Get user data
 * @route GET /api/users/me
 * @access Private
 */
const getMe = async (req: RequestWithUser, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user?.id,
    },
    select: {
      id: true,
      email: true,
      isAdmin: true,
      name: true,
      role: true,
      county: true,
    },
  });
  res.status(200).json(user);
};

/**
 * @description - register/create a user to receive news letters
 * @route POST /api/users/signup
 * @access Public
 */
const newsLetterSignUp = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user && user.password !== null) {
    throw new createError.BadRequest("User already registered");
  }
  try {
     await prisma.user.create({
      data: {
        email,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
   
    res.status(201).json({ message: "User successfully registered" });
  } catch (error) {
    throw new createError.BadRequest("Unable to complete sign up request");
  }
};

export {
  authUser,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  newsLetterSignUp,
  getMe
};
