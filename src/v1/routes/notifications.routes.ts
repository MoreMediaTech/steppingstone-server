import { Router } from "express";
import { notificationsController } from "../controllers/notifications.controller";

const router = Router();

router.all("*", (req, res, next) => {
  console.log(
    "🚀 ~ file: notifications.routes.ts ~ line 13 ~ router.all ~ req.isAuthenticated()",
    req.isAuthenticated()
  );
  
  if (req.isAuthenticated()) {
    next();
  }
});

router
  .route("/")
  .get(notificationsController.getNotifications)
  .post(notificationsController.sendNotificationToUser);
router.route("/:id").put(notificationsController.markNotificationAsRead);
router.route("/all").post(notificationsController.sendNotificationToAllUsers);

export { router };
