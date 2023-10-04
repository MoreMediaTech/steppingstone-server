import { PrismaClient } from "@prisma/client";

import createError from "http-errors";
import { sendEmailVerification } from "./auth.service";

import { PartialUserSchemaProps, UserSchemaProps } from "../../schema/User";
import { sendWelcomeEmail } from "../../utils/sendWelcomeMessage";

const prisma = new PrismaClient();

/**
 * @description - This function is used to create a new user
 * @param data User data
 * @returns
 */
async function createUser(data: PartialUserSchemaProps) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    // Check if user exists
    if (existingUser) {
      throw new createError.BadRequest("User already exists!");
    }

    const user = await prisma.user.create({
      data: {
        email: data?.email as string,
        name: data?.name as string,
        isAdmin: false,
      },
    });

    await prisma.$disconnect();
    if (user) {
      sendWelcomeEmail(
        user.email,
        user.name,
        "Welcome to Stepping Stones"
      );
      sendEmailVerification(user.id, user.name, user.email)
    };

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
      allowsPushNotifications: true,
      isNewlyRegistered: true,
      pushTokens: true,
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
      allowsPushNotifications: true,
      isNewlyRegistered: true,
      pushTokens: true,
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
const updateUser = async (id: string, data: Partial<UserSchemaProps>) => {
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
      allowsPushNotifications: data.allowsPushNotifications === true || data.allowsPushNotifications === false ? data.allowsPushNotifications : foundUser.allowsPushNotifications,
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
 * @returns - success, message
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


/**
 * @description§ - This function is used to add or remove push notification token
 * @param param0  - id, pushToken, operation
 * @returns  - success, message
 */
const addOrRemovePushNotificationToken = async ({ id, pushToken, operation}: { id: string; operation: string, pushToken: string}) => {
    const foundUser = await prisma.user.findUnique({
        where: {
            id: id as string,
        },
    })

    if (!foundUser) throw new createError.NotFound("User not found");

    
    if (operation === "add") {
      const foundPushToken = await prisma.pushToken.findUnique({
          where: {
              token: pushToken,
          }
      });
  
      if (foundPushToken) return { success: true, message: "Push token already exists" };
      await prisma.pushToken.create({
        data: {
          token: pushToken,
          user: { connect: { id: foundUser.id } },
        },
      })
    } else if (operation === "remove") {
      await prisma.pushToken.delete({
        where: {
          token: pushToken,
        },
      })
    }

    await prisma.$disconnect();
    return { success: true, message: "Push token updated successfully" };
};

export const userService = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  addOrRemovePushNotificationToken,
};
