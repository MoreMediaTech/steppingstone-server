import e, { Router } from "express";
import { isAdmin, restrictTo } from "../../middleware/authMiddleware";
import { partialSupportLogSchema } from "../../schema/SupportLog";
import { validate } from "../../middleware/validate";
import { supportLogController } from "../controllers/support-log.controller";

const router = Router();

router
  .route("/")
  .get(
    isAdmin,
    restrictTo("ADMIN", "SUPERADMIN"),
    supportLogController.getAllSupportLogs
  )
  .post(
    validate(partialSupportLogSchema),
    supportLogController.createSupportLog
  );
router
  .route("/:id")
  .put(
    restrictTo("USER", "ADMIN", "SUPERADMIN"),
    supportLogController.updateSupportLog
  )
  .delete(isAdmin, restrictTo("ADMIN", "SUPERADMIN"), supportLogController.deleteSupportLog);
router.route("/delete-many").delete(isAdmin, restrictTo("ADMIN", "SUPERADMIN"), supportLogController.deleteManySupportLogs);

export { router };
