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
  createEconomicDataWidget,
  getEconomicDataWidgetById,
  updateEconomicDataWidgetById,
  deleteEconomicDataWidgetById,
  updateOrCreateDistrictWhyInvestIn,
  updateOrCreateEconomicData,
  updateOrCreateDistrictBusinessParks,
  updateOrCreateDistrictCouncilGrants,
  updateOrCreateDistrictCouncilServices,
  updateOrCreateDistrictLocalNews,
  updateOrCreateCountyWelcome,
  updateOrCreateCountyNews,
  updateOrCreateCountyLEP,
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
  .post(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), addDistrict);
router
  .route("/district/:id")
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getDistrictById)
  .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateDistrictById);

router
  .route("/section")
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
  .route("/why-invest")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictWhyInvestIn
  );

router
  .route("/economic-data")
  .post(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), createEconomicDataWidget)
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateEconomicData
  );

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
  .route("/business-parks")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictBusinessParks
  );

router
  .route("/council-grants")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictCouncilGrants
  );

router
  .route("/council-services")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictCouncilServices
  );

router
  .route("/local-news")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictLocalNews
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
