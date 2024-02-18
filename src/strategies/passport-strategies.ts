import { Strategy as LocalStrategy } from "passport-local";
import createError from "http-errors";
import prisma from "../client";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { authService } from "../v1/services/auth.service";
import passport from "../config/passportConfig";

passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  console.log('Inside deserializeUser callback')
  console.log(`The Deserialized user id passport saved in the session file store is: ${id}`)
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) new createError.InternalServerError("User not found");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


export default passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "oneTimeCode",
      passReqToCallback: true,
    },
    async (req, email, oneTimeCode, done) => {
      const { isMobile } = req.body;

      try {
        const token = await prisma.token.findUnique({
          where: {
            oneTimeCode: oneTimeCode,
          },
          include: {
            user: true,
          },
        });

        // Check if the token exists and is valid
        if (!token || !token.valid)
          throw new createError.Unauthorized(
            "Unauthorized. Invalid one-time code."
          );

        // Check if the token has expired
        if (token?.expiration < new Date())
          throw new createError.Unauthorized(
            "Unauthorized. One-time code expired."
          );

        // Check if the user email in the token matches the email in the request body
        if (token?.user.email !== email)
          throw new createError.Unauthorized(
            "Unauthorized. One-time code expired."
          );

        const data = {
          email: token?.user.email,
          isMobile: isMobile,
          oneTimeCode: oneTimeCode,
        };

        const user = await authService.authenticateUser(data);

        done(null, user.user);
      } catch (error) {
        if (error instanceof PrismaClientUnknownRequestError) {
          const err = new createError.InternalServerError(error.message);
          return done(err, false, {
            message: "Unable to login user. Please try again later.",
          });
        }
        return done(error, false, {
          message: "Unable to login user. Please try again later.",
        });
      }
    }
  )
);
