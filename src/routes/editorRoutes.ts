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
    protect,
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    getDirectories
  )
  .post(
    protect,
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    createDirectory
  );
router
  .route("/:id")
  .get(
    protect,
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    getDirectoryById
  )
  .put(protect, isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"))
  .delete(protect, isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"));

export default router;