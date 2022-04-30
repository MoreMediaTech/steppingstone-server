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
exports.addDirectoryComment = exports.updateDirectory = exports.createDirectory = exports.deleteDirectoryById = exports.getDirectoryById = exports.getPublishedDirectories = exports.getDirectories = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getDirectories = (req, res) => {
    try {
        const directories = prisma.directory.findMany({});
        res.status(200).json(directories);
    }
    catch (error) {
        if (error instanceof Error) {
            throw (0, http_errors_1.default)(400, error.message);
        }
        throw (0, http_errors_1.default)(400, "Invalid request");
    }
};
exports.getDirectories = getDirectories;
const getPublishedDirectories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const directories = yield prisma.directory.findMany({
            where: {
                published: true,
            },
        });
        res.status(200).json(directories);
    }
    catch (error) {
        if (error instanceof Error) {
            throw (0, http_errors_1.default)(400, error.message);
        }
        throw (0, http_errors_1.default)(400, "Invalid request");
    }
});
exports.getPublishedDirectories = getPublishedDirectories;
const getDirectoryById = (req, res) => { };
exports.getDirectoryById = getDirectoryById;
const deleteDirectoryById = (req, res) => { };
exports.deleteDirectoryById = deleteDirectoryById;
const createDirectory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, location, company, personOfContact, description, category } = req.body;
    if (!name ||
        !location ||
        !company ||
        !personOfContact ||
        !description ||
        !category) {
        throw (0, http_errors_1.default)(400, "Missing required fields");
    }
    try {
        const directory = yield prisma.directory.create({
            data: {
                name,
                location,
                company,
                personOfContact,
                description,
                category,
                author: { connect: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id } },
            },
            select: {
                id: true,
                name: true,
                location: true,
                company: true,
                personOfContact: true,
                description: true,
                category: true,
            },
        });
        res.status(201).json(directory);
    }
    catch (error) {
        if (error instanceof Error) {
            throw (0, http_errors_1.default)(400, error.message);
        }
        throw (0, http_errors_1.default)(400, "Invalid request");
    }
});
exports.createDirectory = createDirectory;
const updateDirectory = (req, res) => {
    const { id } = req.params;
    const { name, location, company, personOfContact, description, category } = req.body;
    if (!name ||
        !location ||
        !company ||
        !personOfContact ||
        !description ||
        !category) {
        throw (0, http_errors_1.default)(400, "Missing required fields");
    }
    try {
        const directory = prisma.directory.update({
            where: {
                id,
            },
            data: {
                name,
                location,
                company,
                personOfContact,
                description,
                category,
            },
        });
        res.status(200).json(directory);
    }
    catch (error) {
        if (error instanceof Error) {
            throw (0, http_errors_1.default)(400, error.message);
        }
        throw (0, http_errors_1.default)(400, "Invalid request");
    }
};
exports.updateDirectory = updateDirectory;
const addDirectoryComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { comment } = req.body;
    if (!comment) {
        throw (0, http_errors_1.default)(400, "Missing required fields");
    }
    try {
        yield prisma.directory.update({
            where: {
                id,
            },
            data: {
                comments: {
                    create: {
                        comment,
                    }
                },
            },
        });
    }
    catch (error) {
        if (error instanceof Error) {
            throw (0, http_errors_1.default)(400, error.message);
        }
        throw (0, http_errors_1.default)(400, "Invalid request");
    }
});
exports.addDirectoryComment = addDirectoryComment;
//# sourceMappingURL=directoryControllers.js.map