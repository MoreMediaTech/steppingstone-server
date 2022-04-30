"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const router = (0, express_1.Router)();
exports.router = router;
router.route("/login").post(userControllers_1.authUser);
router.route("/register").post(userControllers_1.registerUser);
//# sourceMappingURL=authRoutes.js.map