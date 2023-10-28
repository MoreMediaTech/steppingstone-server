import e, { Router } from 'express';
import { isAdmin, restrictTo } from '../../middleware/authMiddleware';
import { partialSupportLogSchema } from '../../schema/SupportLog';
import { validate } from '../../middleware/validate';

const router = Router();

router
  .route("/")
  .get(isAdmin, restrictTo("ADMIN", "SUPERADMIN"))
  .post(validate(partialSupportLogSchema));
router
  .route("/:id")
  .put(isAdmin, restrictTo("ADMIN", "SUPERADMIN"))
  .delete(isAdmin, restrictTo("ADMIN", "SUPERADMIN"));
router.route("/delete-many").delete(isAdmin, restrictTo("ADMIN", "SUPERADMIN"));

export { router };