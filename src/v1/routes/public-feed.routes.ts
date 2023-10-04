import { Router } from "express";
import editorController from "../controllers/editor.controller";
import { userController } from "../controllers/user.controller";
import { validatePartialUserWithToken } from "../../schema/User";


const router = Router();

router.route("/").get(editorController.publicFeed);
router
  .route("/newslettersignup")
  .post(validatePartialUserWithToken, userController.newsLetterSignUp);

export { router };
