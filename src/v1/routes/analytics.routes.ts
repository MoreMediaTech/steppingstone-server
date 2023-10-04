import { Router } from "express";

import { analyticsController } from "../controllers/analytics.controller";

const router = Router();

router.route("/").get(analyticsController.getAnalytics);
router.route("/add-online-user").post(analyticsController.addOnlineUser);
router.route("/viewed").post(analyticsController.viewed);
router.route("/record-load-times").post(analyticsController.recordLoadTimes);

export { router };
