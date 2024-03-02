import { Router } from "express";
import { notificationsController } from "../controllers/notifications.controller";

const router = Router();

router.all("*", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
});

router
  .route("/")
  .get(notificationsController.getNotifications)
  .post(notificationsController.sendNotificationToUser)
  .put(notificationsController.markAllNotificationAsRead);
router
  .route("/:id")
  .get(notificationsController.getNotificationById)
  .put(notificationsController.markNotificationAsRead);
  
router.route("/all").post(notificationsController.sendNotificationToAllUsers);
router.route("/archive").post(notificationsController.archiveAllNotifications);

export { router };
