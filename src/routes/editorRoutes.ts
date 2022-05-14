import { Router } from "express";
import {
  getDirectories,
  getPublishedDirectories,
  getDirectoryById,
  deleteDirectoryById,
  createDirectory,
  updateDirectory,
  addDirectoryComment,
} from "../controllers/editor.controller";
import { isAdmin, protect, restrictTo } from "../middleware/authMiddleware";

const router = Router();

router.get('/feed', getPublishedDirectories)
router
  .route("/")
  .get(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    getDirectories
  )
  .post(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    createDirectory
  );
router
  .route("/:id")
  .get(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    getDirectoryById
  )
  .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"))
  .delete(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"));

export default router;