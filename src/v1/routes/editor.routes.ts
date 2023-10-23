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
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.addCounty
  );

router
  .route("/county/:id")
  .get(editorController.getCountyById)
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.updateCounty
  )
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.removeCounty
  );

router
  .route("/delete-counties")
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.removeManyCounties
  );

router
  .route("/district")
  .post(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.addDistrict
  );

router.route("/districts/:id").get(editorController.getDistricts);

router
  .route("/district/:id")
  .get(editorController.getDistrictById)
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.updateDistrictById
  )
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.deleteDistrictById
  );

router
  .route("/delete-districts")
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.deleteManyDistricts
  );

router
  .route("/section")
  .get(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.getSections
  )
  .post(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.createSection
  );

router
  .route("/section/:id")
  .get(editorController.getSectionById)
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.updateSectionById
  )
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.deleteSection
  );

router
  .route("/delete-sections")
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.deleteManySections
  );

router
  .route("/subsection")
  .post(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.createSubsection
  );

router
  .route("/subsection/:id")
  .get(editorController.getSubsectionById)
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.updateSubsectionById
  )
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.deleteSubsection
  );

router
  .route("/delete-subsections")
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
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
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.createDistrictSection
  );

router
  .route("/district-section/:id")
  .get(editorController.getDistrictSectionById)
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.updateDistrictSectionById
  )
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.deleteDistrictSection
  );

router
  .route("/delete-district-sections")
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.deleteManyDistrictSections
  );

router
  .route("/economic-data")
  .post(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.createEconomicDataWidget
  );

router
  .route("/get-ed-widgets/:id")
  .get(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.getEconomicDataWidgets
  );

router
  .route("/economic-data/:id")
  .get(editorController.getEconomicDataWidgetById)
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.updateEconomicDataWidgetById
  )
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.deleteEconomicDataWidgetById
  );

router
  .route("/delete-ed-widgets")
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.deleteManyEconomicDataWidgets
  );

router
  .route("/county-welcome")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.updateOrCreateCountyWelcome
  );

router
  .route("/county-news")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.updateOrCreateCountyNews
  );

router
  .route("/county-lep")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.updateOrCreateCountyLEP
  );

router
  .route("/source-directory")
  .get(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.getAllSDData
  )
  .post(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.createSDData
  );

router
  .route("/source-directory/:type")
  .get(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.getSDDataByType
  )
  .patch(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.updateSDData
  )
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.deleteSDData
  );

router
  .route("/delete-source-directories/:type")
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    editorController.deleteManySDData
  );

export { router };
