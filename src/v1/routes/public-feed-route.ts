import { Router } from "express";
import editorController from "../controllers/editor.controller";

const router = Router();

router.route("/").get(editorController.publicFeed);

export { router };
