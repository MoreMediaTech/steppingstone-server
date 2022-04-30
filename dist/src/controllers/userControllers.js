var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { validateEmail } from "../utils/emailVerification";
const prisma = new PrismaClient();
const authUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!password || !email) {
        return new createError.BadRequest("Missing required fields");
    }
    if (!validateEmail(email)) {
        return new createError.BadRequest("Email address is not valid");
    }
    try {
        const user = yield prisma.user.findUnique({
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
        const checkPassword = bcrypt.compareSync(password, user.password);
        if (!checkPassword)
            throw new createError.Unauthorized("Email address or password not valid");
        const accessToken = generateToken(user.id);
        res.status(200).json(Object.assign(Object.assign({}, user), { accessToken }));
    }
    catch (error) {
        throw new createError.Unauthorized("Email address or password not valid");
    }
});
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    if (!name || !password || !email) {
        return new createError.BadRequest("Missing required fields");
    }
    if (!validateEmail(email)) {
        return new createError.BadRequest("Email address is not valid");
    }
    const user = yield prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (user) {
        throw new createError.BadRequest("User already exists");
    }
    try {
        const user = yield prisma.user.create({
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
        res.status(201).json(Object.assign(Object.assign({}, user), { accessToken }));
    }
    catch (error) {
        throw new createError.BadRequest("Email address already in use");
    }
});
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany({
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
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma.user.delete({
        where: {
            id,
        },
    });
    res.status(200).json(user);
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma.user.findUnique({
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
});
export { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, };
//# sourceMappingURL=userControllers.js.map