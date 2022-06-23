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
  createDistrictWhyInvestIn,
  updateOrCreateDistrictWhyInvestIn,
  updateOrCreateEconomicData,
  updateOrCreateDistrictBusinessParks,
  updateOrCreateDistrictCouncilGrants,
  updateOrCreateDistrictCouncilServices,
  updateOrCreateDistrictLocalNews,
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
  .post(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    createDistrictWhyInvestIn
  );
router
  .route("/why-invest")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictWhyInvestIn
  );

router
  .route("/economic-data")
  .post(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateEconomicData
  );

router
  .route("/business-parks")
  .post(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictBusinessParks
  );


router
  .route("/council-grants")
  .post(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictCouncilGrants
  );

router
  .route("/council-services")
  .post(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictCouncilServices
  );


router
  .route("/local-news")
  .post(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictLocalNews
  );



export { router };
