import { Router } from "express";
import { notificationsController } from "../controllers/notifications.controller";

const router = Router();

router
  .route("/")
  .get(notificationsController.getNotifications)
  .post(notificationsController.sendNotificationToUser);
router.route('/:id').put(notificationsController.markNotificationAsRead);
router.route("/all").post(notificationsController.sendNotificationToAllUsers);

export { router };
