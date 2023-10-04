import { Router } from "express";
import partnerController from "../controllers/partner.controller";
import { isAdmin, restrictTo } from "../../middleware/authMiddleware";

const router = Router();

router
  .route("/directory")
  .get(isAdmin, restrictTo("SS_EDITOR"), partnerController.getAllPartnersData)
  .post(
    isAdmin,
    restrictTo("COUNTY_EDITOR", "SS_EDITOR"),
    partnerController.createPartnerData
  );
router
  .route("/directory/:id")
  .get(
    isAdmin,
    restrictTo("PARTNER"),
    partnerController.getPartnerDataById
  )
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR"),
    partnerController.deletePartnerDataById
  )
  .put(isAdmin, restrictTo("SS_EDITOR"), partnerController.updatePartnerData);

router
  .route("/delete-directories")
  .delete(
    isAdmin,
    restrictTo("SS_EDITOR"),
    partnerController.deleteManyPartnerData
  );

router
  .route("/all/:id")
  .get(isAdmin, restrictTo("SS_EDITOR"), partnerController.getAllPartnerData);

export { router };
