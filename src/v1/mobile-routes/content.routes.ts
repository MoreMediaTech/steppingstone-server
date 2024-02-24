import { Router } from "express";
import passport from "passport";

import contentController from "../controllers/content.controller";

const router = Router();

const jwtAuthMiddleware = passport.authenticate("jwt", { session: false });

// ********* Feed Content *********
router.get("/feed", jwtAuthMiddleware, contentController.getPublishedContent);
router.get("/feed/:id", jwtAuthMiddleware, contentController.getFeed);
router
  .route("/feed-content/:id")
  .get(jwtAuthMiddleware, contentController.getFeedContentById)

// ********* Local feed *********
router
  .route("/local-feed")
  .get(jwtAuthMiddleware, contentController.getLocalFeed)


router
  .route("/feed-content/local-feed/:id")
  .get(jwtAuthMiddleware, contentController.getLocalFeedByFeedContentId);

router
  .route("/local-feed/:id")
  .get(jwtAuthMiddleware, contentController.getLocalFeedById)


// ********* Section *********

router
  .route("/section/:id")
  .get(jwtAuthMiddleware, contentController.getSectionById)

router.route("/sections/:parentId").get(jwtAuthMiddleware, contentController.getSectionByParentId);

router
  .route("/sections/:feedContentId")
  .get(jwtAuthMiddleware, contentController.getSectionByFeedContentId);

router
  .route("/sections/:localFeedContentId")
  .get(jwtAuthMiddleware, contentController.getSectionByLocalFeedContentId);


// ********* Economic data *********

router
  .route("/get-ed-widgets/:id")
  .get(jwtAuthMiddleware, contentController.getEconomicDataWidgets);

router
  .route("/economic-data/:id")
  .get(jwtAuthMiddleware, contentController.getEconomicDataWidgetById)



export { router };
