import { Router } from "express";
import contentController from "../controllers/content.controller";
import { isAdmin, restrictTo } from "../../middleware/authMiddleware";

const router = Router();

router.get("/feed", contentController.getPublishedContent);
router.get("/feed/:id", contentController.getFeedContent);

router
  .route("/county")
  .get(contentController.getCounties)
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.addCounty
  );

router
  .route("/county/:id")
  .get(contentController.getCountyById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.updateCounty
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    contentController.removeCounty
  );

router
  .route("/delete-counties")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    contentController.removeManyCounties
  );

router
  .route("/district")
  .get(contentController.getAllDistricts)
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.addDistrict
  );

router.route("/districts/:id").get(contentController.getDistrictsByCountyId);

router
  .route("/district/:id")
  .get(contentController.getDistrictById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.updateDistrictById
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    contentController.deleteDistrictById
  );

router
  .route("/delete-districts")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    contentController.deleteManyDistricts
  );

router
  .route("/section")
  .get(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.getSections
  )
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.createSection
  );

router
  .route("/section/:id")
  .get(contentController.getSectionById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.updateSectionById
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    contentController.deleteSection
  );

router
  .route("/delete-sections")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    contentController.deleteManySections
  );

router
  .route("/subsection")
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.createSubsection
  );

router
  .route("/subsection/:id")
  .get(contentController.getSubsectionById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.updateSubsectionById
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    contentController.deleteSubsection
  );

router
  .route("/delete-subsections")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    contentController.deleteManySubsections
  );

router
  .route("/sub-subsections/:id")
  .get(contentController.getSubSectionsBySectionId);

router
  .route("/district-sections/:id")
  .get(contentController.getDistrictSectionsByDistrictId);

router
  .route("/district-section")
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.createDistrictSection
  );

router
  .route("/district-section/:id")
  .get(contentController.getDistrictSectionById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.updateDistrictSectionById
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    contentController.deleteDistrictSection
  );

router
  .route("/delete-district-sections")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    contentController.deleteManyDistrictSections
  );

router
  .route("/economic-data")
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.createEconomicDataWidget
  );

router
  .route("/get-ed-widgets/:id")
  .get(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.getEconomicDataWidgets
  );

router
  .route("/economic-data/:id")
  .get(contentController.getEconomicDataWidgetById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.updateEconomicDataWidgetById
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    contentController.deleteEconomicDataWidgetById
  );

router
  .route("/delete-ed-widgets")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    contentController.deleteManyEconomicDataWidgets
  );

router
  .route("/county-welcome")
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.updateOrCreateCountyWelcome
  );

router
  .route("/county-news")
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.updateOrCreateCountyNews
  );

router
  .route("/county-lep")
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.updateOrCreateCountyLEP
  );

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
    contentController.createSDData
  );

router
  .route("/source-directory/:type")
  .get(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    contentController.getSDDataByType
  )
  .patch(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    contentController.updateSDData
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    contentController.deleteSDData
  );

router
  .route("/delete-source-directories/:type")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    contentController.deleteManySDData
  );

export { router };
