import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import createError from "http-errors";
import { sendEmailVerification } from "./auth.service";
import { resetPasswordVerificationEmailTemplate } from "../../utils/emailTemplates";
import { sendMail } from "./messages.service";
import { User } from "../../../types";

const prisma = new PrismaClient();

/**
 * @description - This function is used to create a new user
 * @param data User data
 * @returns
 */
async function createUser(data: Partial<User>) {
  try {
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
        email: data?.email as string,
        name: data?.name as string,
        password: bcrypt.hashSync(data?.password as string, 10),
        isAdmin: false,
      },
    });

    await prisma.$disconnect();
    if (user) sendEmailVerification(user.id, user.name, user.email);

    return { success: true, message: "User created successfully" };
  } catch (error) {
    throw new createError.BadRequest("Unable to create user");
  }
}

/**
 *
 * @returns array of users
 */
const getUsers = async () => {
  const foundUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      isAdmin: true,
      name: true,
      role: true,
      county: true,
      district: true,
      contactNumber: true,
      organisation: true,
      postCode: true,
      emailVerified: true,
      imageUrl: true,
      isSuperAdmin: true,
      acceptTermsAndConditions: true,
    },
  });
  return foundUsers;
};

/**
 *
 * @param id
 * @returns  user
 */
const getUserById = async (id: string) => {
  const foundUser = await prisma.user.findUnique({
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
      district: true,
      contactNumber: true,
      organisation: true,
      postCode: true,
      emailVerified: true,
      imageUrl: true,
      isSuperAdmin: true,
      acceptTermsAndConditions: true,
    },
  });
  await prisma.$disconnect();
  return foundUser;
};

/**
 *
 * @param id
 * @param data
 * @returns
 */
const updateUser = async (id: string, data: Partial<User>) => {
  const foundUser = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!foundUser) {
    throw new Error("User not found");
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      email: data.email ? data.email : foundUser.email,
      isAdmin: data.isAdmin ? data.isAdmin : foundUser.isAdmin,
      name: data.name ? data.name : foundUser.name,
      role: data.role ? data.role : foundUser.role,
      county: data.county ? data.county : foundUser.county,
      district: data.district ? data.district : foundUser.district,
      contactNumber: data.contactNumber
        ? data.contactNumber
        : foundUser.contactNumber,
      postCode: data.postCode ? data.postCode : foundUser.postCode,
      imageUrl: data.imageUrl ? data.imageUrl : foundUser.imageUrl,
      acceptTermsAndConditions:
        data.acceptTermsAndConditions === true ||
        data.acceptTermsAndConditions === false
          ? data.acceptTermsAndConditions
          : foundUser.acceptTermsAndConditions,
      isNewlyRegistered:
        data.isNewlyRegistered === true || data.isNewlyRegistered === false
          ? data.isNewlyRegistered
          : foundUser.isNewlyRegistered,
    },
  });

  if (data.organisation) {
    await prisma.organisation.upsert({
      where: {
        userId: id,
      },
      update: {
        name: data.organisation,
      },
      create: {
        name: data.organisation as string,
        user: { connect: { id: foundUser.id } },
      },
    });
  }
  await prisma.$disconnect();
  return { success: true, message: "User updated successfully" };
};

/**
 *
 * @param id
 * @returns
 */
const deleteUser = async (id: string) => {
  const deletedUser = await prisma.user.delete({
    where: {
      id,
    },
  });
  await prisma.$disconnect();
  return deletedUser;
};

/**
 * @description - This function is used to reset user password and send a verification email to the user
 * @param data
 * @returns
 */
async function resetPassword(data: any) {
  const foundUser = await prisma.user.findUnique({
    where: {
      id: data.id,
    },
  });

  let checkPassword;

  // Check if password is valid
  if (foundUser && foundUser.password !== null) {
    checkPassword = bcrypt.compareSync(
      data?.password as string,
      foundUser.password
    );
  }

  if (!checkPassword) throw new createError.Unauthorized("Password not valid");

  const updatedUser = await prisma.user.update({
    where: {
      id: data.id,
    },
    data: {
      password: bcrypt.hashSync(data?.newPassword as string, 10),
    },
  });

  await prisma.$disconnect();
  const name = updatedUser.name;
  const subject = "Password reset successful.";

  const textMSGFormat = `
            from: ${"admin@steppingstonesapp.com"}\r\n
            subject: ${subject}\r\n
            message: ${`Password has been successfully reset.`}
        `;

  const msg = {
    to: updatedUser.email, // Change to your recipient
    from: "admin@steppingstonesapp.com", // Change to your verified sender
    subject: subject,
    text: textMSGFormat, // Plain text body
    html: resetPasswordVerificationEmailTemplate(name), // HTML body
  };
  await sendMail(msg, "RESET_PASSWORD_SUCCESS");
  return { success: true, message: "Password successfully reset" };
}

/**
 * @description - This function gets all favorites for a user
 * @param id
 * @returns
 */
const getUserFavorites = async (id: string) => {
  const foundFavorites = await prisma.favoriteItem.findMany({
    where: {
      userId: id,
    },
  });
  return foundFavorites;
};

/**
 * @description - This function is used to add a favorite item to a users favorites list
 * @param id
 * @param contentId
 * @param contentType
 * @param title
 * @returns
 */
const addToFavorites = async (
  id: string,
  contentId: string,
  contentType: string,
  title: string,
  screen: string,
  countyId: string
) => {
  const foundUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!foundUser) throw new createError.NotFound("User not found");

  await prisma.favoriteItem.create({
    data: {
      user: { connect: { id: foundUser.id } },
      title: title,
      screen: screen,
      contentId: contentId,
      contentType: contentType,
      county: { connect: { id: countyId } },
    },
  });

  await prisma.$disconnect();
  return { success: true, message: "Added to favorites" };
};

/**
 * @description - This function is used to remove favorite item from user's favorites
 * @param id
 * @returns
 */
const removeFromFavorites = async (id: string) => {
  await prisma.favoriteItem.delete({
    where: {
      id: id,
    },
  });
  await prisma.$disconnect();
  return { success: true, message: "Removed from favorites" };
};

export const userService = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  resetPassword,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
};
