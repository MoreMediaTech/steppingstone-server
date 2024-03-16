import { Router } from "express";
import contentController from "../controllers/content.controller";
import { userController } from "../controllers/user.controller";
import { validatePartialUserWithToken } from "../../schema/User";

const router = Router();

router.route("/").get(contentController.publicFeed);
router
  .route("/register")
  .post(validatePartialUserWithToken, userController.newsLetterSignUp);

router.route("/signup").post(userController.newsLetterSignUp);

export { router };
