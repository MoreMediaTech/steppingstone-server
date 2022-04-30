import { Router } from "express";
import { authUser, registerUser } from "../controllers/userControllers";
const router = Router();
router.post("/login", authUser);
router.post("/register", registerUser);
export { router };
//# sourceMappingURL=authRoutes.js.map