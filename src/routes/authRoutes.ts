import { Router } from "express";
import { authUser, registerUser, logout } from "../controllers/auth.controller";

const router = Router();

router.route("/login").post(authUser);
router.route("/register").post(registerUser);
router.route("/logout").post(logout);

export  {router};