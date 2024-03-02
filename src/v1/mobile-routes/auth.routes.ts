import { Router } from "express";
import passport from "passport";

import { loginLimiter } from "../../middleware/loginLimiter";
import { authController } from "./../controllers/auth.controller";
import { validatePartialUserWithToken } from "../../schema/User";

import "../../strategies/passport-strategies";

const router = Router();

// jwtAuthMiddleware is a middleware that checks if the user is authenticated
const jwtAuthMiddleware = passport.authenticate("jwt", { session: false });

router
  .route("/login")
  .post(validatePartialUserWithToken, loginLimiter, authController.login);

router
  .route("/authenticate")
  .post(
    validatePartialUserWithToken,
    loginLimiter,
    authController.authenticateMobileUser
  );

router
  .route("/register")
  .post(validatePartialUserWithToken, authController.registerUser);

router.route("/logout/:id").get(authController.mobileLogout);

export { router };
