import { Request, Response } from "express";
import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../types";
import { generateRefreshToken, generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

async function createUser(data: User) {
  try {
    if (!data.acceptTermsAndConditions) {
      return new createError.BadRequest(
        "You must accept the terms and conditions"
      );
    }
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
        email: data.email,
        password: bcrypt.hashSync(data.password, 10),
        name: data.name,
        county: data.county,
        district: data.district,
        organisation: {
          create: {
            name: data.organisation,
          },
        },
        postCode: data.postCode,
        contactNumber: data.contactNumber,
        acceptTermsAndConditions: data.acceptTermsAndConditions,
      },
    });
    await prisma.$disconnect();
    return { message: "User created successfully" };
  } catch (error) {
    throw new createError.BadRequest("Unable to create user");
  }
}
async function loginUser(data: User) {
  const foundUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isAdmin: true,
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
    checkPassword = bcrypt.compareSync(data?.password, foundUser.password);
  }

  if (!checkPassword)
    throw new createError.Unauthorized("Email address or password not valid");

  const user = {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
    role: foundUser.role,
    isAdmin: foundUser.isAdmin,
  };

  const accessToken =  await generateToken(user.id);

  const refreshToken = await generateRefreshToken(user.id);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshTokens: {
        create: {
          refreshToken: refreshToken,
        }
      },
    }
  })


  await prisma.$disconnect();
  return {
    accessToken,
    refreshToken,
    user,
  };
}

 async function logoutUser(req: Request, res: Response) {
  const cookies = req.cookies;
  if (!cookies.ss_refresh_token) return;
  const refreshToken: string = cookies.ss_refresh_token;
  let userId: string | undefined;
 jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET ?? "",
    async (err: any, payload: any) => {
      if (err) return new createError.Unauthorized();
      userId = payload.userId;
    }
  );
   await prisma.refreshToken.deleteMany({
    where: {
      userId: userId,
    }
  })
  return { message: "User logged out successfully" };
}

export const authService = {
  createUser,
  loginUser,
  logoutUser,
}
