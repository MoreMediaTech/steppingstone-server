import { Router } from "express";
import { loginLimiter } from "../../middleware/loginLimiter";
import { authController } from "./../controllers/auth.controller";
import { validatePartialUserWithToken } from "../../schema/User";

import "../../strategies/passport-strategies";
import passport from "../../config/passportConfig";
import { isAdmin } from "../../middleware/authMiddleware";

const router = Router();

router
  .route("/login")
  .post(validatePartialUserWithToken, loginLimiter, authController.login);

router
  .route("/authenticate")
  .post(
    validatePartialUserWithToken,
    passport.authenticate("local"),
    authController.authenticate
  );

router
  .route("/register")
  .post(
    validatePartialUserWithToken,
    passport.authenticate("local"),
    authController.registerUser
  );

router.route("/logout").get(authController.logout);

router.route("/verify-email").post(authController.verifyEmail);

router.route("/update-user").put(
  (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
  },
  isAdmin,
  authController.updateUser
);

router.route("/validate-token").post(authController.validateToken);

export { router };
