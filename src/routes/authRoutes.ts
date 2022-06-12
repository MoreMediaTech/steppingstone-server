import { Router } from "express";
import { authUser, registerUser, verifyEmail, updateUser, validateToken, requestReset, logout } from "../controllers/auth.controller";

const router = Router();

router.route("/login").post(authUser);
router.route("/register").post(registerUser);
router.route("/logout").post(logout);
router.route('/verify-email').post(verifyEmail);
router.route('/update-user').post(updateUser);
router.route('/validate-token').post(validateToken);
router.route("/request-reset").post(requestReset);
router.route("/reset-password").post(requestReset);

export  {router};