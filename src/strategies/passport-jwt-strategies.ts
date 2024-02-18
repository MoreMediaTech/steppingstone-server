import { Strategy as JWTStrategy } from "passport-jwt";
import passport from "../config/passportConfig";

passport.serializeUser((user, done) => {});

passport.deserializeUser((id, done) => {});

export default passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies["access_token"];
        }
        return token;
      },
      secretOrKey: process.env.JWT_SECRET as string,
    },
    async (jwtPayload, done) => {
      try {
        if (jwtPayload.exp < Date.now() / 1000) {
          return done(null, false, { message: "Token expired" });
        }
        return done(null, jwtPayload);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);