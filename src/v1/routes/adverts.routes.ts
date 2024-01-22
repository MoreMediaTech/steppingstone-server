import { Router } from "express";
import { advertController } from "../controllers/advert.controllers";
import { protect, isAdmin, restrictTo } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validate";
import { partialAdvertSchema } from "../../schema/Advert";

const router = Router();

router
  .route("/")
  .get(protect, advertController.getAdverts)

router
  .route("/create").post(
    validate(partialAdvertSchema),
    protect,
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    advertController.createAdvert
  )
router
  .route("/:id")
  .get(
    protect,
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    advertController.getAdvertById
  )
  .put(
    validate(partialAdvertSchema),
    protect,
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    advertController.updateAdvert
  )
  .delete(
    validate(partialAdvertSchema),
    protect,
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    protect,
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    advertController.deleteAdvert
  );

export { router };
