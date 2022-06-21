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
  updateDistrictWhyInvestIn,
} from "../controllers/editor.controller";
import { isAdmin, protect, restrictTo } from "../middleware/authMiddleware";

const router = Router();

router.get("/feed", getPublishedCounties);


router
  .route("/county")
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getCounties)
  .post(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    addCounty
  );

router
  .route("/county/:id")
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getCountyById)
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateCounty
  )
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    removeCounty
  );

router.route('/county/district').post(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), addDistrict);
router.route('/county/district/:id').get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getDistrictById).put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateDistrictById);
router
  .route("/county/district/why-invest")
  .post(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    createDistrictWhyInvestIn
  );
router
  .route("/county/district/why-invest/:id")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateDistrictWhyInvestIn
  );

export { router};


