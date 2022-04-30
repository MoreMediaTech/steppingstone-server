"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
exports.router = router;
router.route("/").get(authMiddleware_1.protect, authMiddleware_1.isAdmin, userControllers_1.getUsers);
router.route("/signup").post(userControllers_1.newsLetterSignUp);
router
    .route("/:id")
    .delete(authMiddleware_1.protect, authMiddleware_1.isAdmin, userControllers_1.deleteUser)
    .get(authMiddleware_1.protect, authMiddleware_1.isAdmin, userControllers_1.getUserById)
    .put(authMiddleware_1.protect, authMiddleware_1.isAdmin, userControllers_1.updateUserProfile);
//# sourceMappingURL=userRoutes.js.map