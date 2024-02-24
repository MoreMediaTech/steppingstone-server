import { Router } from "express";
import partnerController from "../controllers/partner.controller";
import { isAdmin, restrictTo } from "../../middleware/authMiddleware";

const router = Router();

router.all("*", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
});
router
  .route("/directory")
  .get(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    partnerController.getAllPartnersData
  )
  .post(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    partnerController.createPartnerData
  );
router
  .route("/directory/:id")
  .get(
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
