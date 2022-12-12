import { Router } from "express";
import {messagesController } from "../controllers/messages.controller";
import { isAdmin, protect, restrictTo } from "../middleware/authMiddleware";
const router = Router();

router
  .route("/")
  .get(
    protect,
    isAdmin,
    restrictTo("SS_EDITOR"),
    messagesController.getAllInAppEnquiryMsg
  );

router.route("/received-by-user").get(protect,messagesController.getAllReceivedMessagesByUser);
router.route("/sent-by-user").get(protect,messagesController.getAllSentMessagesByUser);
router.route("/sendEnquiry").post(messagesController.sendEnquiry);
router.route("/sendMail").post(messagesController.sendEmail);
router
  .route("/delete-many")
  .delete(protect,messagesController.deleteManyMessages);
router
  .route("/:id")
  .delete(protect,messagesController.deleteMessageById)
  .get(protect,messagesController.getMessageById);

router.route("/status/:id").patch(protect,messagesController.updateMsgStatusById);

export { router };
