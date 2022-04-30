import { Router } from "express";
import { authUser, registerUser } from "../controllers/userControllers";

const router = Router();

router.route("/login").post(authUser);
router.route("/register").post(registerUser);

export  {router};
