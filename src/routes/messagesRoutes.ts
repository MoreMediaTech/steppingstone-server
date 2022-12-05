import { Router } from "express";
import {messagesController } from "../controllers/messages.controller";
import { isAdmin, protect, restrictTo } from "../middleware/authMiddleware";
const router = Router();

router
  .route("/")
  .get(protect, isAdmin, restrictTo("SS_EDITOR"),messagesController.getAllEnquiryMessages);

router.route("/user").get(protect,messagesController.getAllMessagesByUser);
router.route("/sendEnquiry").post(messagesController.sendEnquiry);
router.route("/sendMail").post(messagesController.sendEmail);
router
  .route("/delete-many")
  .delete(protect,messagesController.deleteManyMessages);
router
  .route("/:id")
  .delete(protect,messagesController.deleteMailById)
  .get(protect,messagesController.getMessageById);

router.route("/update-status/:id").patch(protect,messagesController.updateMsgStatusById);

export { router };
