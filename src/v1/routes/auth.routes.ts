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
import { validate } from "../../middleware/validate";

const router = Router();

router.route("/login").post(loginLimiter, login);
router.route("/authenticate").post(authenticate);
router.route("/register").post(registerUser);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/update-user").put(updateUser);
router.route("/validate-token").post(validateToken);

export { router };
