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
router.get('/', protect, isAdmin, restrictTo('SS_EDITOR', 'COUNTY_EDITOR'), getDirectories)
router.post('/', protect, isAdmin, restrictTo('SS_EDITOR', 'COUNTY_EDITOR'),  createDirectory)

export default router;