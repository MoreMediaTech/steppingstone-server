import createError  from "http-errors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { User } from "../../types";

const prisma = new PrismaClient();


export async function createUser(data: User) {
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
          }
        },
        postCode: data.postCode,
        contactNumber: data.contactNumber,
        acceptTermsAndConditions: data.acceptTermsAndConditions,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    await prisma.$disconnect();
    return user;
  } catch (error) {
    throw new createError.BadRequest("Unable to create user");
  }
}
export async function loginUser(data: User) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
    },
  });
  await prisma.$disconnect();
  // Check if user exists
  if (!user) {
    throw new createError.NotFound("User not registered");
  }
  let checkPassword;

  // Check if password is valid
  if (user && user.password !== null) {
    checkPassword = bcrypt.compareSync(data?.password, user.password);
  }

  if (!checkPassword)
    throw new createError.Unauthorized("Email address or password not valid");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
