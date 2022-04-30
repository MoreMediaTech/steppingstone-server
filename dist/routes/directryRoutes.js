"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const directoryControllers_1 = require("../controllers/directoryControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/feed', directoryControllers_1.getPublishedDirectories);
router.get('/', authMiddleware_1.protect, authMiddleware_1.isAdmin, directoryControllers_1.getDirectories);
router.post('/', authMiddleware_1.protect, authMiddleware_1.isAdmin, directoryControllers_1.createDirectory);
//# sourceMappingURL=directryRoutes.js.map