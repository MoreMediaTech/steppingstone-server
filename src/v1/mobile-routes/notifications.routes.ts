import { Router } from "express";
import passport from "passport";
import { notificationsController } from "../controllers/notifications.controller";

const router = Router();

const jwtAuthMiddleware = passport.authenticate("jwt", { session: false });

router
  .route("/")
  .get(jwtAuthMiddleware, notificationsController.getNotifications);
router
  .route("/:id")
  .put(jwtAuthMiddleware, notificationsController.markNotificationAsRead);

export { router };
