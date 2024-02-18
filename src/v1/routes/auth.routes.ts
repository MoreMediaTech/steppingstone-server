import { Router } from "express";
import {
  login,
  authenticate,
  registerUser,
  verifyEmail,
  updateUser,
  validateToken,
  logout,
} from "../controllers/auth.controller";
import { loginLimiter } from "../../middleware/loginLimiter";
import { validatePartialUserWithToken } from "../../schema/User";

import "../../strategies/passport-strategies";
import passport from "../../config/passportConfig";

const router = Router();

router.route("/login").post(validatePartialUserWithToken, loginLimiter, login);
router
  .route("/authenticate")
  .post(
    validatePartialUserWithToken,
    passport.authenticate("local"),
    authenticate
  );
router.route("/register").post(validatePartialUserWithToken, registerUser);
router.route("/logout").get(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/update-user").put(updateUser);
router.route("/validate-token").post(validateToken);

export { router };
