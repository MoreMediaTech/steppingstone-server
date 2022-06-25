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
  updateOrCreateDistrictWhyInvestIn,
  updateOrCreateEconomicData,
  updateOrCreateDistrictBusinessParks,
  updateOrCreateDistrictCouncilGrants,
  updateOrCreateDistrictCouncilServices,
  updateOrCreateDistrictLocalNews,
  updateOrCreateFeatureArticle,
  updateOrCreateOnlineDigitilisation,
} from "../controllers/editor.controller";
import { isAdmin, protect, restrictTo } from "../middleware/authMiddleware";

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
  .route("/why-invest")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictWhyInvestIn
  );

router
  .route("/economic-data")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateEconomicData
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
  .route("/feature-article")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateFeatureArticle
  );

router
  .route("/online-digitilisation")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateOnlineDigitilisation
  );



export { router };
