import { Router } from "express";
import {
  updateUserProfile,
  createUser,
  getUsers,
  deleteUser,
  getUserById,
  newsLetterSignUp,
  getMe,
  resetUserPassword,
} from "../controllers/user.controller";
import { isAdmin, protect } from "../middleware/authMiddleware";
const router = Router();

router
  .route("/")
  .get(protect, isAdmin, getUsers)
  .post(protect, isAdmin, createUser);

router.route("/getMe").get(protect, getMe);

router.route("/signup").post(newsLetterSignUp);

router
  .route("/:id")
  .delete(protect, isAdmin, deleteUser)
  .get(protect, isAdmin, getUserById)
  .put(protect, isAdmin, updateUserProfile);
  
router.route("/resetCredentials/:id").put(protect, isAdmin, resetUserPassword);

export { router };
