import { Router } from "express";
import passport from "passport";
import { uploadImageFile } from "../controllers/upload.controller";

const router = Router();

const jwtAuthMiddleware = passport.authenticate("jwt", { session: false });

router.route("/").post(jwtAuthMiddleware, uploadImageFile);

export { router };
