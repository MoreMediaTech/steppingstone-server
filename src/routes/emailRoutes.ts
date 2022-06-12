import { Router } from "express";
import {
  deleteMailById,
  getAllMail,
  sendEnquiry,
  sendEmail,
  getMessageById,
} from "../controllers/email.controller";
import { isAdmin, protect, restrictTo } from "../middleware/authMiddleware";
const router = Router();

router.route("/").get(protect, isAdmin, restrictTo('SS_EDITOR'),getAllMail);
router
  .route("/id")
  .delete(protect, isAdmin, restrictTo("SS_EDITOR"), deleteMailById)
  .get(protect, isAdmin, restrictTo("SS_EDITOR"), getMessageById);
router.route('/sendEnquiry').post(sendEnquiry);
router.route('/sendMail').post(sendEmail);


export {router};
