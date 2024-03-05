import { Router } from "express";
import passport from "passport";
import { notificationsController } from "../controllers/notifications.controller";

const router = Router();

const jwtAuthMiddleware = passport.authenticate("jwt", { session: false });

router
  .route("/")
  .get(jwtAuthMiddleware, notificationsController.getNotifications)
  .put(jwtAuthMiddleware, notificationsController.markAllNotificationAsRead);

router
  .route("/:id")
  .get(jwtAuthMiddleware, notificationsController.getNotificationById)
  .put(jwtAuthMiddleware, notificationsController.markNotificationAsRead);

router.route("/all").post(jwtAuthMiddleware, notificationsController.sendNotificationToAllUsers);
router.route("/archive").post(jwtAuthMiddleware, notificationsController.archiveAllNotifications);

export { router };


