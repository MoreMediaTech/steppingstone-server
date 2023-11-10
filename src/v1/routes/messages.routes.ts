import { Router } from "express";
import { messagesController } from "../controllers/messages.controller";
import { isAdmin, protect, restrictTo } from "../../middleware/authMiddleware";
const router = Router();

router
  .route("/folder")
  .get(protect, messagesController.getFoldersWithMessagesCount)
  .post(protect, messagesController.getMessagesForFolder);

router.route("/folder/:id").post(protect, messagesController.getMessageInFolder);

router.route("/send-enquiry").post(messagesController.sendEnquiry);
router.route("/send-mail").post(protect, messagesController.sendEmail);

router
  .route("/delete-many")
  .delete(protect, messagesController.deleteManyMessages);
router
  .route("/:id")
  .delete(protect, messagesController.deleteMessageById)
  .get(protect, messagesController.getMessageById);

router
  .route("/status/:id")
  .patch(protect, messagesController.updateMsgStatusById);

router.route("/create-folder").post(protect, messagesController.createFolder);
router
  .route("/create-user-folder")
  .post(protect, messagesController.createUserFolder);

router
  .route("/create-enquiries-folder")
  .post(protect, isAdmin, messagesController.createEnquiryFolder);

export { router };
