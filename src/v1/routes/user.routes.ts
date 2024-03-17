import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { isAdmin, restrictTo } from "../../middleware/authMiddleware";

const router = Router();

router.all("*", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
});

router
  .route("/")
  .get(isAdmin, userController.getUsers)
  .post(isAdmin, restrictTo("SUPERADMIN"), userController.createUser);

router.route("/getMe").get(userController.getMe);

router
  .route("/:id")
  .delete(isAdmin, restrictTo("SUPERADMIN"), userController.deleteUser)
  .get(userController.getUserById)
  .put(userController.updateUserProfile);

export { router };
