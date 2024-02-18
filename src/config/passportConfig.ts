import { Application } from "express";
import passport from "passport";

export const passportConfig = (app: Application) => {
  app.use(passport.initialize());
  app.use(passport.session());
//   app.use(passport.authenticate("session"));
};

export default passport;