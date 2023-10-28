import { Router } from "express";
import editorController from "../controllers/editor.controller";
import { isAdmin, restrictTo } from "../../middleware/authMiddleware";

const router = Router();

router.get("/feed", editorController.getPublishedContent);

router
  .route("/county")
  .get(editorController.getCounties)
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.addCounty
  );

router
  .route("/county/:id")
  .get(editorController.getCountyById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.updateCounty
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    editorController.removeCounty
  );

router
  .route("/delete-counties")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    editorController.removeManyCounties
  );

router
  .route("/district")
  .get(editorController.getAllDistricts)
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.addDistrict
  );

router.route("/districts/:id").get(editorController.getDistrictsByCountyId);

router
  .route("/district/:id")
  .get(editorController.getDistrictById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.updateDistrictById
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    editorController.deleteDistrictById
  );

router
  .route("/delete-districts")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    editorController.deleteManyDistricts
  );

router
  .route("/section")
  .get(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.getSections
  )
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.createSection
  );

router
  .route("/section/:id")
  .get(editorController.getSectionById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.updateSectionById
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    editorController.deleteSection
  );

router
  .route("/delete-sections")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    editorController.deleteManySections
  );

router
  .route("/subsection")
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.createSubsection
  );

router
  .route("/subsection/:id")
  .get(editorController.getSubsectionById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.updateSubsectionById
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    editorController.deleteSubsection
  );

router
  .route("/delete-subsections")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    editorController.deleteManySubsections
  );

router
  .route("/sub-subsections/:id")
  .get(editorController.getSubSectionsBySectionId);

router
  .route("/district-sections/:id")
  .get(editorController.getDistrictSectionsByDistrictId);

router
  .route("/district-section")
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.createDistrictSection
  );

router
  .route("/district-section/:id")
  .get(editorController.getDistrictSectionById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.updateDistrictSectionById
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    editorController.deleteDistrictSection
  );

router
  .route("/delete-district-sections")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    editorController.deleteManyDistrictSections
  );

router
  .route("/economic-data")
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.createEconomicDataWidget
  );

router
  .route("/get-ed-widgets/:id")
  .get(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.getEconomicDataWidgets
  );

router
  .route("/economic-data/:id")
  .get(editorController.getEconomicDataWidgetById)
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.updateEconomicDataWidgetById
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    editorController.deleteEconomicDataWidgetById
  );

router
  .route("/delete-ed-widgets")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    editorController.deleteManyEconomicDataWidgets
  );

router
  .route("/county-welcome")
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.updateOrCreateCountyWelcome
  );

router
  .route("/county-news")
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.updateOrCreateCountyNews
  );

router
  .route("/county-lep")
  .put(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.updateOrCreateCountyLEP
  );

router
  .route("/source-directory")
  .get(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.getAllSDData
  )
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.createSDData
  );

router
  .route("/source-directory/:type")
  .get(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    editorController.getSDDataByType
  )
  .patch(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    editorController.updateSDData
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    editorController.deleteSDData
  );

router
  .route("/delete-source-directories/:type")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    editorController.deleteManySDData
  );

export { router };
