import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { isAdmin, protect } from "../../middleware/authMiddleware";
const router = Router();

router
  .route("/")
  .get(protect, isAdmin, userController.getUsers)
  .post(protect, isAdmin, userController.createUser);

router.route("/getMe").get(protect, userController.getMe);

router.route("/signup").post(userController.newsLetterSignUp);

router
  .route("/resetCredentials/:id")
  .put(protect, userController.resetUserPassword);

router
  .route("/favorites")
  .get(protect, userController.getUserFavorites)
  .post(protect, userController.addToFavorites);

router
  .route("/favorites/:id")
  .delete(protect, userController.removeFromFavorites);

router
  .route("/:id")
  .delete(protect, isAdmin, userController.deleteUser)
  .get(protect, userController.getUserById)
  .put(protect, userController.updateUserProfile);

export { router };
