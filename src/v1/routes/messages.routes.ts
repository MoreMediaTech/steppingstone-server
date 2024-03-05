import { Router } from "express";
import { messagesController } from "../controllers/messages.controller";
import { isAdmin, restrictTo } from "../../middleware/authMiddleware";
const router = Router();

router
  .route("/folder")
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
  }, messagesController.getFoldersWithMessagesCount)
  .post((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
  }, messagesController.getMessagesForFolder);

router.route("/folder/:id").post((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
}, messagesController.getMessageInFolder);

router.route("/send-enquiry").post(messagesController.sendEnquiry);
router.route("/send-mail").post(messagesController.sendEmail);

router.route("/delete-many").delete((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
}, messagesController.deleteManyMessages);
router
  .route("/:id")
  .delete((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
  }, messagesController.deleteMessageById)
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
  }, messagesController.getMessageById);

router.route("/status/:id").patch((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
}, messagesController.updateMsgStatusById);

router.route("/create-folder").post((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
}, messagesController.createFolder);
router.route("/create-user-folder").post((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
}, messagesController.createUserFolder);

router.route("/create-enquiries-folder").post(
  (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
  },
  isAdmin,
  messagesController.createEnquiryFolder
);

export { router };
