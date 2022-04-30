import { Router } from "express";
import { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, } from "../controllers/userControllers";
import { isAdmin, protect } from "../middleware/authMiddleware";
const router = Router();
router.post("/login", authUser);
router.post("/register", registerUser);
router
    .route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.route("/").post(registerUser).get(protect, isAdmin, getUsers);
router
    .route("/:id")
    .delete(protect, isAdmin, deleteUser)
    .get(protect, isAdmin, getUserById)
    .put(protect, isAdmin, updateUserProfile);
export { router };
//# sourceMappingURL=userRoutes.js.map