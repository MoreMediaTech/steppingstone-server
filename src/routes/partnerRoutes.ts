import { Router } from "express";
import { createPartnerData, getPartnerData, getPartnersData } from "../controllers/partner.controller";
import { isAdmin, protect, restrictTo } from "../middleware/authMiddleware";

const router = Router();

router
  .route("/partners")
  .get(
    protect,
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    getPartnersData
  )
  .post(protect, isAdmin, restrictTo("PARTNER"), createPartnerData);
router.route('/partners/:id').get(protect, isAdmin, restrictTo("PARTNER"), getPartnerData);

export default router;