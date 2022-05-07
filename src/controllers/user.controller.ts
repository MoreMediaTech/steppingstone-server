import { RequestWithUser } from "../../types";
import createError from "http-errors";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { validateEmail } from "../utils/emailVerification";

const prisma = new PrismaClient();



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
  const user = req.user;
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
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  newsLetterSignUp,
  getMe,
};
