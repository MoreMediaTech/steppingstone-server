import { Router } from "express";
import {
  getDirectories,
  getPublishedDirectories,
  getDirectoryById,
  deleteDirectoryById,
  createDirectory,
  updateDirectory,
  addDirectoryComment,
} from "../controllers/directory.controller";
import { isAdmin, protect } from "../middleware/authMiddleware";

const router = Router();

router.get('/feed', getPublishedDirectories)
router.get('/', protect, isAdmin, getDirectories)
router.post('/', protect, isAdmin, createDirectory)