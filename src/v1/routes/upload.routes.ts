import { Router } from "express";
import { uploadImageFile } from "../controllers/upload.controller";

const router = Router();

router.route("/").post((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
}, uploadImageFile);

export { router };
