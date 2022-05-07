import { Request, Response } from "express";
import createError from "http-errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    isAdmin: boolean;
    name: string;
    role: string;
  } | null;
}

const getDirectories = (req: RequestWithUser, res: Response) => {
  try {
    const directories = prisma.directory.findMany({});
    res.status(200).json(directories);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

const getPublishedDirectories = async (req: RequestWithUser, res: Response) => {
  try {
    const directories = await prisma.directory.findMany({
      where: {
        published: true,
      },
    });
    res.status(200).json(directories);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};
const getDirectoryById = (req: RequestWithUser, res: Response) => {};
const deleteDirectoryById = (req: RequestWithUser, res: Response) => {};
const createDirectory = async (req: RequestWithUser, res: Response) => {
  const { name, county } =
    req.body;
  if (
    !name ||
    !county
  ) {
    throw createError(400, "Missing required fields");
  }
  try {
    const directory = await prisma.directory.create({
      data: {
        name,
        county,
        
        author: { connect: { id: req.user?.id } },
      },
      select: {
        id: true,
        name: true,
        county: true,
      },
    });
    res.status(201).json(directory);
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};
const updateDirectory = (req: RequestWithUser, res: Response) => {
    const { id } = req.params;
    const { name, county } =
        req.body;
    if (
        !name ||
        county
    ) {
        throw createError(400, "Missing required fields");
    }
    try {
        const directory = prisma.directory.update({
        where: {
            id,
        },
        data: {
            name,
            county,
        },
        });
        res.status(200).json(directory);
    } catch (error) {
        if (error instanceof Error) {
        throw createError(400, error.message);
        }
        throw createError(400, "Invalid request");
    }
};
const addDirectoryComment = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const  comment: string = req.body.comment;
  if (!comment) {
    throw createError(400, "Missing required fields");
  }
  try {
    await prisma.directory.update({
      where: {
        id,
      },
      data: {
        comments: {
            create: {
                comment: comment,
                    author: {connect: { id: req.user?.id }},
                },
                
            }
        },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw createError(400, error.message);
    }
    throw createError(400, "Invalid request");
  }
};

export {
  getDirectories,
  getPublishedDirectories,
  getDirectoryById,
  deleteDirectoryById,
  createDirectory,
  updateDirectory,
  addDirectoryComment,
};
