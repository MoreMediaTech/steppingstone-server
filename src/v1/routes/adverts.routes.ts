import { Router } from "express";
import { advertController } from "../controllers/advert.controllers";
import { isAdmin, restrictTo } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validate";
import { partialAdvertSchema } from "../../schema/Advert";

const router = Router();

router.all("*", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
});

router.route("/").get(advertController.getAdverts);

router.route("/create").post(
  validate(partialAdvertSchema),

  isAdmin,
  restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
  advertController.createAdvert
);
router
  .route("/:id")
  .get(
    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    advertController.getAdvertById
  )
  .put(
    validate(partialAdvertSchema),

    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    advertController.updateAdvert
  )
  .delete(
    validate(partialAdvertSchema),

    isAdmin,
    restrictTo("EDITOR", "ADMIN", "SUPERADMIN"),
    advertController.deleteAdvert
  );

export { router };
