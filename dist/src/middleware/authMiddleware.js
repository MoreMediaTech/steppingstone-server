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
import dotenv from "dotenv";
import { verifyAccessToken } from "../utils/jwt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
dotenv.config();
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        return next(new createError.Unauthorized("No token provided. Access token is required"));
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return next(new createError.Unauthorized("No token provided. Access token is required"));
    }
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            const decoded = verifyAccessToken(token);
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
                next(new createError.Unauthorized(error.message));
            }
            next(new createError.Unauthorized('Invalid token'));
        }
    }
});
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        next(new createError.Unauthorized("Not authorized as an admin"));
    }
};
export { protect, isAdmin };
//# sourceMappingURL=authMiddleware.js.map