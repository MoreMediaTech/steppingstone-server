import { Router, Request, Response, NextFunction } from "express";
import { userController } from "../controllers/user.controller";
import { isAdmin, restrictTo } from "../../middleware/authMiddleware";
import passport from "passport";
const router = Router();


// Custom middleware to check JWT authentication status
const checkAuthStatus = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: Express.User) => {

    if (user) {
      req.user = user; // Optional: Attach user object to the request
      req.isAuthenticated = () => true;
    } else {
      req.isAuthenticated = () => false;
    }
    next();
  })(req, res, next);
};


router
  .route("/")
  .get(
    (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      }
    },
    isAdmin,
    userController.getUsers
  )
  .post(isAdmin, restrictTo("SUPERADMIN"), userController.createUser);

router.route("/getMe").get((req, res, next) => {
  console.log(
    "🚀 ~ file: user.routes.ts ~ line 78 ~ .get ~ req.isAuthenticated()",
    req.isAuthenticated()
  );
  console.log("🚀 ~ file: user.routes.ts ~ line 78 ~ .get ~ User: ", req.user);
  if (req.isAuthenticated()) {
    next();
  }
}, userController.getMe);

router
  .route("/mobile/getMe")
  .get(passport.authenticate('jwt', { session: false }), userController.getMe);

// TODO: move route to public-feed.routes.ts
router.route("/signup").post((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
}, userController.newsLetterSignUp);

router.route("/notifications").post((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
}, userController.addOrRemovePushNotificationToken);

router
  .route("/favorites")
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
  }, userController.getUserFavorites)
  .post((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
  }, userController.addToFavorites);

router.route("/favorites/:id").delete((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
}, userController.removeFromFavorites);

router
  .route("/:id")
  .delete(
    (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      }
    },
    isAdmin,
    restrictTo("SUPERADMIN"),
    userController.deleteUser
  )
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
  }, userController.getUserById)
  .put((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
  }, userController.updateUserProfile);

export { router };
