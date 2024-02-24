import { Router } from "express";
import { loginLimiter } from "../../middleware/loginLimiter";
import { authController } from "./../controllers/auth.controller";
import { validatePartialUserWithToken } from "../../schema/User";

import "../../strategies/passport-strategies";

const router = Router();

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

router.route("/logout").get(authController.logout);

export { router };
