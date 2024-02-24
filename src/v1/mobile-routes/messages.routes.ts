import { Router } from "express";
import passport from "passport";

import { messagesController } from "../controllers/messages.controller";
import { isAdmin } from "../../middleware/authMiddleware";


const router = Router();

const jwtAuthMiddleware = passport.authenticate("jwt", { session: false });

router
  .route("/folder")
  .get(jwtAuthMiddleware, messagesController.getFoldersWithMessagesCount)
  .post(jwtAuthMiddleware, messagesController.getMessagesForFolder);

router
  .route("/folder/:id")
  .post(jwtAuthMiddleware, messagesController.getMessageInFolder);

router
  .route("/send-enquiry")
  .post(jwtAuthMiddleware, messagesController.sendEnquiry);
router
  .route("/send-mail")
  .post(jwtAuthMiddleware, messagesController.sendEmail);

router
  .route("/delete-many")
  .delete(jwtAuthMiddleware, messagesController.deleteManyMessages);
router
  .route("/:id")
  .delete(jwtAuthMiddleware, messagesController.deleteMessageById)
  .get(jwtAuthMiddleware, messagesController.getMessageById);

router
  .route("/status/:id")
  .patch(jwtAuthMiddleware, messagesController.updateMsgStatusById);

router
  .route("/create-folder")
  .post(jwtAuthMiddleware, messagesController.createFolder);
router
  .route("/create-user-folder")
  .post(jwtAuthMiddleware, messagesController.createUserFolder);

router
  .route("/create-enquiries-folder")
  .post(jwtAuthMiddleware, isAdmin, messagesController.createEnquiryFolder);

export { router };
