import { Router, Request, Response, NextFunction } from "express";
import { userController } from "../controllers/user.controller";
import { isAdmin, restrictTo } from "../../middleware/authMiddleware";
import passport from "passport";
const router = Router();

// Custom middleware to check JWT authentication status
const jwtAuthMiddleware = passport.authenticate("jwt", { session: false });

router.route("/getMe").get(jwtAuthMiddleware, userController.getMe);

// TODO: move to notifications.routes.ts
router
  .route("/notifications")
  .post(jwtAuthMiddleware, userController.addOrRemovePushNotificationToken);

router
  .route("/favorites")
  .get(jwtAuthMiddleware, userController.getUserFavorites)
  .post(jwtAuthMiddleware, userController.addToFavorites);

router
  .route("/favorites/:id")
  .delete(jwtAuthMiddleware, userController.removeFromFavorites);

router
  .route("/:id")
  .get(jwtAuthMiddleware, userController.getUserById)
  .put(jwtAuthMiddleware, userController.updateUserProfile);

export { router };
