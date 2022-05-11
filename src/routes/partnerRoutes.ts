import { Router } from "express";
import {
  createPartnerData,
  getAllPartnerData,
  getAllPartnersData,
  getPartnerDataById,
  deletePartnerDataById,
  updatePartnerData,
} from "../controllers/partner.controller";
import { isAdmin, protect, restrictTo } from "../middleware/authMiddleware";

const router = Router();

router
  .route("/")
  .get(
    protect,
    isAdmin,
    restrictTo("PARTNER","SS_EDITOR", "COUNTY_EDITOR"),
    getAllPartnerData
  )
  .post(protect, isAdmin, restrictTo("PARTNER"), createPartnerData);
router
  .route("/:id")
  .get(protect, isAdmin, restrictTo("PARTNER"), getPartnerDataById)
  .delete(
    protect,
    isAdmin,
    restrictTo("PARTNER", "SS_EDITOR", "COUNTY_EDITOR"),
    deletePartnerDataById
  )
  .put(
    protect,
    isAdmin,
    restrictTo("PARTNER", "SS_EDITOR", "COUNTY_EDITOR"),
    updatePartnerData
  );
router
  .route("/all")
  .get(
    protect,
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    getAllPartnersData
  );

export { router };
