import { Router } from "express";
import {
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  newsLetterSignUp,
  getMe,
} from "../controllers/userControllers";
import { isAdmin, protect } from "../middleware/authMiddleware";
const router = Router();

router.route("/").get(protect, isAdmin, getUsers);
router.route("getMe").get(protect, getMe);
router.route("/signup").post(newsLetterSignUp);
router
  .route("/:id")
  .delete(protect, isAdmin, deleteUser)
  .get(protect, isAdmin, getUserById)
  .put(protect, isAdmin, updateUserProfile);

export {router};