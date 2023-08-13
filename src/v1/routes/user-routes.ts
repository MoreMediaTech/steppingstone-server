import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { isAdmin } from "../../middleware/authMiddleware";
const router = Router();

router
  .route("/")
  .get(isAdmin, userController.getUsers)
  .post(isAdmin, userController.createUser);

router.route("/getMe").get(userController.getMe);

router.route("/signup").post(userController.newsLetterSignUp);

router.route("/notifications").post(userController.addOrRemovePushNotificationToken);

router
  .route("/resetCredentials/:id")
  .put(userController.resetUserPassword);

router
  .route("/favorites")
  .get(userController.getUserFavorites)
  .post(userController.addToFavorites);

router
  .route("/favorites/:id")
  .delete(userController.removeFromFavorites);

router
  .route("/:id")
  .delete(isAdmin, userController.deleteUser)
  .get(userController.getUserById)
  .put(userController.updateUserProfile);

export { router };
