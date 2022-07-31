import { Router } from "express";
import {
  getPublishedCounties,
  getCounties,
  addCounty,
  updateCounty,
  removeCounty,
  getCountyById,
  addDistrict,
  getDistrictById,
  updateDistrictById,
  createSection,
  getSectionById,
  updateSectionById,
  deleteSection,
  createSubsection,
  getSubsectionById,
  updateSubsectionById,
  deleteSubsection,
  createSubSubSection,
  getSubSubSectionById,
  updateSubSubSectionById,
  deleteSubSubSectionById,
  createDistrictSection,
  getDistrictSectionById,
  getDistrictSectionsByDistrictId,
  updateDistrictSectionById,
  deleteDistrictSection,
  createEconomicDataWidget,
  getEconomicDataWidgetById,
  updateEconomicDataWidgetById,
  deleteEconomicDataWidgetById,
  updateOrCreateCountyWelcome,
  updateOrCreateCountyNews,
  updateOrCreateCountyLEP,
  getDistricts,
  getSections,
  deleteDistrictById,
} from "../controllers/editor.controller";
import { isAdmin, restrictTo } from "../middleware/authMiddleware";

const router = Router();

router.get("/feed", getPublishedCounties);

router
  .route("/county")
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getCounties)
  .post(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), addCounty);

router
  .route("/county/:id")
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getCountyById)
  .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateCounty)
  .delete(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), removeCounty);

router
  .route("/district")
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getDistricts)
  .post(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), addDistrict);

router
  .route("/district/:id")
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getDistrictById)
  .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateDistrictById)
  .delete(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), deleteDistrictById);

router
  .route("/section")
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getSections)
  .post(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), createSection)

  router
    .route("/section/:id")
    .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getSectionById)
    .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateSectionById)
    .delete(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), deleteSection);

router
  .route("/subsection")
  .post(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), createSubsection)

router
  .route("/subsection/:id")
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getSubsectionById)
  .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateSubsectionById)
  .delete(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), deleteSubsection);

router
  .route("/sub-subsection")
  .post(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), createSubSubSection)

router
  .route("/sub-subsection/:id")
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getSubSubSectionById)
  .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateSubSubSectionById)
  .delete(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), deleteSubSubSectionById);

  router
    .route("/district-sections/:id")
    .get(
      isAdmin,
      restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
      getDistrictSectionsByDistrictId
    );

  router
    .route("/district-section")
    .post(
      isAdmin,
      restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
      createDistrictSection
    );

  router
    .route("/district-section/:id")
    .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getDistrictSectionById)
    .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateDistrictSectionById)
    .delete(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), deleteDistrictSection);


router
  .route("/economic-data")
  .post(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), createEconomicDataWidget)

router
  .route("/economic-data/:id")
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getEconomicDataWidgetById)
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateEconomicDataWidgetById
  )
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    deleteEconomicDataWidgetById
  );
  

router
  .route("/county-welcome")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateCountyWelcome
  );

router
  .route("/county-news")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateCountyNews
  );

router
  .route("/county-lep")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateCountyLEP
  );

export { router };
