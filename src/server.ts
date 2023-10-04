import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

import { router as authRoutes } from "./v1/routes/auth.routes";
import { router as userRoutes } from "./v1/routes/user.routes";
import { router as partnerRoutes } from "./v1/routes/partner.routes";
import { router as refreshRoutes } from "./v1/routes/refresh-token.routes";
import { router as messagesRoutes } from "./v1/routes/messages.routes";
import { router as editorRoutes } from "./v1/routes/editor.routes";
import { router as uploadRoute } from "./v1/routes/upload.routes";
import { router as analyticsRoutes } from "./v1/routes/analytics.routes";
import { router as publicFeedRoute } from "./v1/routes/public-feed.routes";
import { router as notificationsRoutes } from "./v1/routes/notifications.routes";
import { ensureAuthenticated } from "./middleware/authMiddleware";
import { credentials } from "./middleware/credentials";
import { corsOptions } from "./config/corsOptions";
import { ApiError } from "./middleware/apiErrorMiddleware";
import { logger } from "./middleware/logger";
import ErrorHandler from "./middleware/apiErrorMiddleware";
import { env } from "./utils/env";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

export const app: Application = express();
const PORT = process.env.PORT || 5001;

// Log all error events to file
app.use(logger);

// node version 16.15.1
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirements
app.use(credentials);

// Cross origin resource sharing
app.use(cors(corsOptions));

// middleware for parsing cookies
app.use(cookieParser());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// express-session middleware for session management
app.use(
  session({
    genid(req) {
      return uuidv4(); // use UUIDs for session IDs
    },
    secret: env.REFRESH_TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "none",
      secure: true,
    },
  })
);
// passport middleware for authentication
app.use(passport.initialize());
app.use(passport.session());

// express middleware for parsing json
app.use(express.json({ limit: "5mb" }));


// Routes
app.use("/v1/auth", authRoutes);
app.use("/v1/refresh", refreshRoutes);
app.use("/v1/messages", messagesRoutes);
app.use("/v1/feed", publicFeedRoute);

app.use(ensureAuthenticated);
app.use("/v1/analytics", analyticsRoutes);
app.use("/v1/editor", editorRoutes);
app.use("/v1/notifications", notificationsRoutes);
app.use("/v1/partners", partnerRoutes);
app.use("/v1/users", userRoutes);
app.use("/v1/upload", uploadRoute);

// UnKnown Routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(err);
});

// Global Error Handler
app.use(ErrorHandler.handle());

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
