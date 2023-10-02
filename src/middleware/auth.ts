import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import createError from "http-errors";
import prisma from "../client";
import { Prisma } from "@prisma/client";
import {
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

passport.use(
  "authenticate",
  new LocalStrategy(async (username: string, password: string, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email: username } });
      if (!user) return done(null, false, { message: "Invalid username" });

      return done(null, user);
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError) {
        const err = new createError.InternalServerError(error.message);
        return done(err);
      }
      return done(error);
    }
  })
);

passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});
