
import { RequestWithUser } from "../../types";
import createError from "http-errors";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { uploadService } from "../services/upload.service";
import { userService } from "../services/user.service";

const prisma = new PrismaClient();

/**
 * @description - create a user to receive news letters
 * @route POST /api/users
 * @access Private
 */
const createUser = async (req: Request, res: Response) => {
  const { name, email, passwordInput} = req.body;
  
  try {
    const newUser = await userService.createUser({ name, email, password: passwordInput });
    res.status(201).json(newUser);
  } catch (error) {
    if(error instanceof createError.BadRequest) {
      throw new createError.BadRequest(error.message);
    }
    throw new createError.BadRequest("Unable to create user");
  }
}

/**
 * @description - update user profile
 * @route PUT /api/auth/:id
 * @access Private
 */
const updateUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;

  const {
    name,
    email,
    isAdmin,
    county,
    role,
    district,
    contactNumber,
    organisation,
    postCode,
    imageFile,
    acceptTermsAndConditions,
    isNewlyRegistered
  } = req.body;

  let image;
  
  if (imageFile && imageFile !== "") {
    image = await uploadService.uploadImageFile(imageFile);
  }

  const data = {
    email,
    isAdmin,
    name,
    role,
    county,
    district,
    contactNumber,
    organisation,
    postCode,
    imageUrl: image?.secure_url,
    acceptTermsAndConditions,
    isNewlyRegistered
  };
  
  try {
    const user = await userService.updateUser(id, data);
    res.status(200).json(user);
  } catch (error) {
    throw new createError.BadRequest("Unable to complete update request")
  }
};


/**
 * @description - Get users data
 * @route GET /api/users
 * @access Private
 */
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    throw new createError.BadRequest("Unable to complete request");
  }
};


/**
 * @description - delete user
 * @route DELETE /api/users/:id
 * @access Private
 */
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await userService.deleteUser(id);
    res.status(200).json(user);
  } catch (error) {
    throw new createError.BadRequest("Unable to complete delete request");
  }
};


/**
 * @description - Get user data
 * @route GET /api/users/:id
 * @access Private/admin
 */
const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
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
}

/**
 * @description - reset user password
 * @param req 
 * @param res 
 */
const resetUserPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {  password, newPassword } = req.body;
  const data = {
    id,
    password,
    newPassword,
  }
  try {
    const updatedUser = await userService.resetPassword(data);
    res.status(200).json({...updatedUser });
  } catch (error) {
    throw new createError.BadRequest("Unable to complete request")
  }
}

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
    throw new createError.BadRequest("User already Signed Up");
  }
  try {
    await prisma.user.create({
      data: {
        email,
        name,
        isNewsletterSubscribed: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    res.status(201).json({ success: true, message: "User successfully registered" });
  } catch (error) {
    throw new createError.BadRequest("Unable to complete sign up request");
  }
};

/**
 * @description - GET user's favorites
 * @route GET /api/v1/users/favorites
 * @access Private
 */
const getUserFavorites = async (req: RequestWithUser, res: Response) => {
  try {
    const result = await userService.getUserFavorites(req.user?.id as string)
    res.status(200).json(result);
  } catch (error) {
    throw new createError.BadRequest("Unable to complete request");
  }
}

/**
 * @description - add to content to user's favorites
 * @route POST /api/v1/users/favorites
 * @access Private
 */
const addToFavorites = async (req: RequestWithUser, res: Response) => {
  const { contentId, contentType, title, screen } = req.body
  try {
    const result = await userService.addToFavorites(
      req.user?.id as string,
      contentId,
      contentType,
      title,
      screen
    );
    res.status(200).json(result);
  } catch (error) {
    throw new createError.BadRequest("Unable to complete request");
  }
}

/**
 * @description - remove content from user's favorites
 * @route DELETE /api/v1/users/favorites/:id
 * @access Private
 */
const removeFromFavorites = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.removeFromFavorites(id);
    res.status(200).json(result);
  } catch (error) {
    throw new createError.BadRequest("Unable to complete request");
  }
};

export const userController = {
  updateUserProfile,
  createUser,
  getUsers,
  deleteUser,
  getUserById,
  newsLetterSignUp,
  getMe,
  resetUserPassword,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites
};
