import { Router } from "express";
import { emailController } from "../controllers/email.controller";
import { isAdmin, protect, restrictTo } from "../middleware/authMiddleware";
const router = Router();

router
  .route("/")
  .get(protect, isAdmin, restrictTo("SS_EDITOR"), emailController.getAllMail);

router.route("/by-user").get(protect, emailController.getAllMailByUserEmail);
router
  .route("/:id")
  .delete(
    protect,
    emailController.deleteMailById
  )
  .get(
    protect,
    emailController.getMessageById
  );
router.route("/sendEnquiry").post(emailController.sendEnquiry);
router.route("/sendMail").post(emailController.sendEmail);
router
  .route("/delete-many")
  .delete(
    protect,
    emailController.deleteManyMessages
  );

export { router };
