import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { validateEmail } from "../utils/emailVerification";

const prisma = new PrismaClient();

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
      },
    });
    return foundUsers
}

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
      },
    });
    return foundUser
}

const updateUser = async (id: string, data: any) => {
    const foundUser = await prisma.user.findUnique({
        where: {
            id
        }
    })
    if(!foundUser){
        throw new Error('User not found')
    }
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        email: data.email ? data.email : foundUser.email,
        password: data.password ? data.password : foundUser.password,
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
      },
    });
    return updatedUser
}


const deleteUser = async (id: string) => {
    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    });
    return deletedUser
}


export const userService = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
}