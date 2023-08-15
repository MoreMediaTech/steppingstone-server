import { Router } from "express";
import { notificationsController } from "../controllers/notifications.controller";

const router = Router();

router
  .route("/")
  .get(notificationsController.getNotifications)
  .post(notificationsController.sendNotification);

export { router };
