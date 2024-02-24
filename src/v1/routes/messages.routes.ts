import { Router } from "express";
import { messagesController } from "../controllers/messages.controller";
import { isAdmin, restrictTo } from "../../middleware/authMiddleware";
const router = Router();

router.all("*", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
});

router
  .route("/folder")
  .get(messagesController.getFoldersWithMessagesCount)
  .post(messagesController.getMessagesForFolder);

router.route("/folder/:id").post(messagesController.getMessageInFolder);

router.route("/send-enquiry").post((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
}, messagesController.sendEnquiry);
router.route("/send-mail").post(messagesController.sendEmail);

router.route("/delete-many").delete(messagesController.deleteManyMessages);
router
  .route("/:id")
  .delete(messagesController.deleteMessageById)
  .get(messagesController.getMessageById);

router.route("/status/:id").patch(messagesController.updateMsgStatusById);

router.route("/create-folder").post(messagesController.createFolder);
router.route("/create-user-folder").post(messagesController.createUserFolder);

router
  .route("/create-enquiries-folder")
  .post(isAdmin, messagesController.createEnquiryFolder);

export { router };
