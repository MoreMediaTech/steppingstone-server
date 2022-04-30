import createError from "http-errors";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { validateEmail } from "../utils/emailVerification";

const prisma = new PrismaClient();

const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return new createError.BadRequest("Missing required fields");
  }

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
    if (!user) {
      throw new createError.NotFound("User not registered");
    }
    let checkPassword;
    if (user && user.password !== null) {
      checkPassword = bcrypt.compareSync(password, user.password);
    }
    if (!checkPassword)
      throw new createError.Unauthorized("Email address or password not valid");

    const accessToken = generateToken(user.id);
    res.status(200).json({
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
const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !password || !email) {
    return new createError.BadRequest("Missing required fields");
  }

  if (!validateEmail(email)) {
    return new createError.BadRequest("Email address is not valid");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user && user.password !== null) {
    throw new createError.BadRequest("User already exists");
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, 10),
        name,
      },
      select: {
        id: true,
        email: true,
        isAdmin: true,
        name: true,
      },
    });
    const accessToken = generateToken(user.id);
    res.status(201).json({ ...user, accessToken });
  } catch (error) {
    throw new createError.BadRequest("Email address already in use");
  }
};
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
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });
  res.status(200).json(user);
};
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
};
