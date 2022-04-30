"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsLetterSignUp = exports.getUserById = exports.deleteUser = exports.getUsers = exports.updateUserProfile = exports.registerUser = exports.authUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const emailVerification_1 = require("../utils/emailVerification");
const prisma = new client_1.PrismaClient();
const authUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!password || !email) {
        return new http_errors_1.default.BadRequest("Missing required fields");
    }
    if (!(0, emailVerification_1.validateEmail)(email)) {
        return new http_errors_1.default.BadRequest("Email address is not valid");
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
            throw new http_errors_1.default.NotFound("User not registered");
        }
        let checkPassword;
        if (user && user.password !== null) {
            checkPassword = bcryptjs_1.default.compareSync(password, user.password);
        }
        if (!checkPassword)
            throw new http_errors_1.default.Unauthorized("Email address or password not valid");
        const accessToken = (0, jwt_1.generateToken)(user.id);
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            role: user.role,
            county: user.county,
            token: accessToken,
        });
    }
    catch (error) {
        throw new http_errors_1.default.Unauthorized("Email address or password not valid");
    }
});
exports.authUser = authUser;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
        return new http_errors_1.default.BadRequest("Missing required fields");
    }
    if (!(0, emailVerification_1.validateEmail)(email)) {
        return new http_errors_1.default.BadRequest("Email address is not valid");
    }
    const user = yield prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (user && user.password !== null) {
        throw new http_errors_1.default.BadRequest("User already exists");
    }
    try {
        const user = yield prisma.user.create({
            data: {
                email,
                password: bcryptjs_1.default.hashSync(password, 10),
                name,
            },
            select: {
                id: true,
                email: true,
                isAdmin: true,
                name: true,
            },
        });
        const accessToken = (0, jwt_1.generateToken)(user.id);
        res.status(201).json(Object.assign(Object.assign({}, user), { accessToken }));
    }
    catch (error) {
        throw new http_errors_1.default.BadRequest("Email address already in use");
    }
});
exports.registerUser = registerUser;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, password, county, role } = req.body;
    const user = yield prisma.user.update({
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
});
exports.updateUserProfile = updateUserProfile;
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
exports.getUsers = getUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma.user.delete({
        where: {
            id,
        },
    });
    res.status(200).json(user);
});
exports.deleteUser = deleteUser;
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
exports.getUserById = getUserById;
const newsLetterSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    const user = yield prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (user && user.password !== null) {
        throw new http_errors_1.default.BadRequest("User already registered");
    }
    try {
        yield prisma.user.create({
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
    }
    catch (error) {
        throw new http_errors_1.default.BadRequest("Unable to complete sign up request");
    }
});
exports.newsLetterSignUp = newsLetterSignUp;
//# sourceMappingURL=userControllers.js.map