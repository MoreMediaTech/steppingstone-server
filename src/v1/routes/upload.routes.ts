import { Router } from "express";
import { isAdmin } from "../../middleware/authMiddleware";
import { uploadImageFile } from "../controllers/upload.controller";

const router = Router();

router.route("/").post(uploadImageFile);

export { router };
