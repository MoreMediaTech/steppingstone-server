import { Router } from "express";
import { isAdmin, restrictTo } from "../../middleware/authMiddleware";
import { partialSupportLogSchema } from "../../schema/SupportLog";
import { validate } from "../../middleware/validate";
import { supportLogController } from "../controllers/support-log.controller";

const router = Router();

router
  .route("/")
  .get(
    (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      }
    },
    isAdmin,
    restrictTo("ADMIN", "SUPERADMIN"),
    supportLogController.getAllSupportLogs
  )
  .post(
    (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      }
    },
    validate(partialSupportLogSchema),
    supportLogController.createSupportLog
  );
router
  .route("/:id")
  .put(
    (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      }
    },
    restrictTo("USER", "ADMIN", "SUPERADMIN"),
    supportLogController.updateSupportLog
  )
  .delete(
    (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      }
    },
    isAdmin,
    restrictTo("ADMIN", "SUPERADMIN"),
    supportLogController.deleteSupportLog
  );
router.route("/delete-many").delete(
  (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
  },
  isAdmin,
  restrictTo("ADMIN", "SUPERADMIN"),
  supportLogController.deleteManySupportLogs
);

export { router };
