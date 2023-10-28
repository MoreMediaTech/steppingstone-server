import { Router } from "express";
import partnerController from "../controllers/partner.controller";
import { isAdmin, protect, restrictTo } from "../../middleware/authMiddleware";

const router = Router();

router
  .route("/directory")
  .get(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    partnerController.getAllPartnersData
  )
  .post(
    protect,
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    partnerController.createPartnerData
  );
router
  .route("/directory/:id")
  .get(
    protect,
    isAdmin,
    restrictTo("PARTNER", "EDITOR", "ADMIN", "SUPERADMIN"),
    partnerController.getPartnerDataById
  )
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    partnerController.deletePartnerDataById
  )
  .put(
    isAdmin,
    restrictTo("PARTNER", "EDITOR", "ADMIN", "SUPERADMIN"),
    partnerController.updatePartnerData
  );

router
  .route("/delete-directories")
  .delete(
    isAdmin,
    restrictTo("EDITOR", "SUPERADMIN"),
    partnerController.deleteManyPartnerData
  );

router
  .route("/all/:id")
  .get(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    partnerController.getAllPartnerData
  );

export { router };
