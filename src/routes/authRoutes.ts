import { Router } from "express";
import { authUser, registerUser, logoutUser } from "../controllers/userControllers";

const router = Router();

router.route("/login").post(authUser);
router.route("/register").post(registerUser);
router.route("/logout").post(logoutUser);

export  {router};
