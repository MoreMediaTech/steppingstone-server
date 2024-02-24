import express from "express";
import { refreshToken } from "../controllers/token.controller";
const router = express.Router();

router.all("*", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
});

router.get("/", refreshToken);
router.post("/mobile", refreshToken);

export { router };
