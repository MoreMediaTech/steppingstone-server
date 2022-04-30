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
exports.isAdmin = exports.protect = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_1 = require("../utils/jwt");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        return next(new http_errors_1.default.Unauthorized("No token provided. Access token is required"));
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return next(new http_errors_1.default.Unauthorized("No token provided. Access token is required"));
    }
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            const decoded = yield (0, jwt_1.verifyAccessToken)(token);
            req.user = yield prisma.user.findUnique({
                where: {
                    id: decoded.id,
                },
                select: {
                    id: true,
                    email: true,
                    isAdmin: true,
                    name: true,
                    role: true,
                    county: true,
                }
            });
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                next(new http_errors_1.default.Unauthorized(error.message));
            }
            next(new http_errors_1.default.Unauthorized('Invalid token'));
        }
    }
});
exports.protect = protect;
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        next(new http_errors_1.default.Unauthorized("Not authorized as an admin"));
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=authMiddleware.js.map