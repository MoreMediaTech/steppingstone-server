import createError from "http-errors";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import prisma from "../client";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) new createError.InternalServerError("User not found");
    done(null, user);
  } catch (error) {
    if (error instanceof PrismaClientUnknownRequestError) {
      const err = new createError.InternalServerError(error.message);
      return done(err, null);
    }
    return done(error, null);
  }
});

export default passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
    },
    async (jwtPayload, done) => {
      try {
        // Check if the token exists and is valid
        if(!jwtPayload) return done(null, false, { message: "Invalid token" });

        // Check if the token has expired
        if (jwtPayload.exp < Date.now() / 1000) {
          return done(null, false, { message: "Token expired" });
        }

        // Check if the user exists in the database
        const user = await prisma.user.findUnique({
            where: {
                id: jwtPayload.sub,
            },
        });

        // If the user does not exist, return an error
        if (!user) {
            return done(null, false, { message: "User not found" });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
