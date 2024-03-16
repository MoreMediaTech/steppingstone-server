import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { isAdmin, restrictTo } from "../../middleware/authMiddleware";

const router = Router();

router.all("*", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
});

router
  .route("/")
  .get(isAdmin, userController.getUsers)
  .post(isAdmin, restrictTo("SUPERADMIN"), userController.createUser);

router.route("/getMe").get(userController.getMe);

router
  .route("/notifications")
  .post(userController.addOrRemovePushNotificationToken);

router
  .route("/favorites")
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
  }, userController.getUserFavorites)
  .post((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
  }, userController.addToFavorites);

router.route("/favorites/:id").delete((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
}, userController.removeFromFavorites);

router
  .route("/:id")
  .delete(
    (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      }
    },
    isAdmin,
    restrictTo("SUPERADMIN"),
    userController.deleteUser
  )
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
  }, userController.getUserById)
  .put((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
  }, userController.updateUserProfile);

export { router };
