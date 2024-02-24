import { Router } from "express";
import contentController from "../controllers/content.controller";
import { isAdmin, restrictTo } from "../../middleware/authMiddleware";
import { partialSectionSchema } from "../../schema/Section";
import { partialFeedContentSchema } from "../../schema/FeedContent";
import { partialCommentSchema } from "../../schema/Comment";
import {
  partialEconomicDataSchema,
  partialLocalFeedSchema,
} from "../../schema/LocalFeedContent";
import { validate } from "../../middleware/validate";
import { partialSourceDirectorySchema } from "../../schema/SourceDirectory";

const router = Router();

router.all("*", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
});

router.get("/feed", contentController.getPublishedContent);
router.get("/feed/:id", contentController.getFeed);

// ********* Feed Content *********
router
  .route("/feed-content")
  .get(contentController.getFeedContent)
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    validate(partialFeedContentSchema),
    contentController.createFeedContent
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    validate(partialFeedContentSchema),
    contentController.removeManyFeedContent
  );

router
  .route("/feed-content/:id")
  .get(contentController.getFeedContentById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    validate(partialFeedContentSchema),
    contentController.updateFeedContent
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    validate(partialFeedContentSchema),
    contentController.removeFeedContent
  );

// ********* Local feed *********
router
  .route("/local-feed")
  .get(contentController.getLocalFeed)
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    validate(partialLocalFeedSchema),
    contentController.createLocalFeed
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    validate(partialLocalFeedSchema),
    contentController.deleteManyLocalFeedContent
  );

router
  .route("/feed-content/local-feed/:id")
  .get(contentController.getLocalFeedByFeedContentId);

router
  .route("/local-feed/:id")
  .get(contentController.getLocalFeedById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    validate(partialLocalFeedSchema),
    contentController.updateLocalFeedById
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    validate(partialLocalFeedSchema),
    contentController.deleteLocalFeedById
  );

// ********* Section *********
router
  .route("/section")
  .get(contentController.getSections)
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    validate(partialSectionSchema),
    contentController.createSection
  );

router
  .route("/section/:id")
  .get(contentController.getSectionById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    validate(partialSectionSchema),
    contentController.updateSectionById
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    validate(partialSectionSchema),
    contentController.deleteSection
  );

router.route("/sections/:parentId").get(contentController.getSectionByParentId);

router
  .route("/sections/:feedContentId")
  .get(contentController.getSectionByFeedContentId);

router
  .route("/sections/:localFeedContentId")
  .get(contentController.getSectionByLocalFeedContentId);

router
  .route("/delete-sections")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    validate(partialSectionSchema),
    contentController.deleteManySections
  );

// ********* Economic data *********
router
  .route("/economic-data")
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    validate(partialEconomicDataSchema),
    contentController.createEconomicDataWidget
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    validate(partialEconomicDataSchema),
    contentController.deleteManyEconomicDataWidgets
  );

router
  .route("/get-ed-widgets/:id")
  .get(contentController.getEconomicDataWidgets);

router
  .route("/economic-data/:id")
  .get(contentController.getEconomicDataWidgetById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    validate(partialEconomicDataSchema),
    contentController.updateEconomicDataWidgetById
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    validate(partialEconomicDataSchema),
    contentController.deleteEconomicDataWidgetById
  );

// ********* Source Directory *********
router
  .route("/source-directory")
  .get(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.getAllSDData
  )
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    validate(partialSourceDirectorySchema),
    contentController.createSDData
  );

router
  .route("/source-directory/:type")
  .get(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.getSDDataByType
  )
  .put(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    validate(partialSourceDirectorySchema),
    contentController.updateSDData
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    validate(partialSourceDirectorySchema),
    contentController.deleteSDData
  );

router
  .route("/delete-source-directories/:type")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    validate(partialSourceDirectorySchema),
    contentController.deleteManySDData
  );

export { router };
