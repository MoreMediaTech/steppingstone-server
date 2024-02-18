import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ObjectId } from "bson";
import cookieParser from "cookie-parser";
import path from "path";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

import { router as authRoutes } from "./v1/routes/auth.routes";
import { router as userRoutes } from "./v1/routes/user.routes";
import { router as partnerRoutes } from "./v1/routes/partner.routes";
import { router as refreshRoutes } from "./v1/routes/refresh-token.routes";
import { router as messagesRoutes } from "./v1/routes/messages.routes";
import { router as editorRoutes } from "./v1/routes/content.routes";
import { router as uploadRoute } from "./v1/routes/upload.routes";
import { router as analyticsRoutes } from "./v1/routes/analytics.routes";
import { router as publicFeedRoute } from "./v1/routes/public-feed.routes";
import { router as notificationsRoutes } from "./v1/routes/notifications.routes";
import { router as supportRoutes } from "./v1/routes/support-log.routes";
import { router as advertRoutes } from "./v1/routes/adverts.routes";
import { protect } from "./middleware/authMiddleware";
import { credentials } from "./middleware/credentials";
import { corsOptions } from "./config/corsOptions";
import { ApiError } from "./middleware/apiErrorMiddleware";
import { logger } from "./middleware/logger";
import ErrorHandler from "./middleware/apiErrorMiddleware";
import prisma from "./client";
import { passportConfig } from "./config/passportConfig";
import "./strategies/passport-strategies";

dotenv.config();

export const app: Application = express();
const PORT = process.env.PORT || 5001;
const sessionId = new ObjectId().toString();
const sess = {
  genid(_req: Request) {
    return sessionId; // use UUIDs for session IDs
  },
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 60000 * 60 * 24 },
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

// Log all error events to file
app.use(logger);

// node version 16.15.1
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirements
app.use(credentials);

// Cross origin resource sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// express middleware for parsing json
app.use(express.json({ limit: "5mb" }));

app.use("/api", express.static(path.join(__dirname, "public")));

app.get("/api", require("./v1/routes/root.routes"));

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.url === "/robots.txt") {
    return res.status(404).end(); // Return a 404 Not Found
  }
  next();
});

// middleware for parsing cookies
app.use(cookieParser());

// express middleware for session
app.use(session(sess));

app.set("trust proxy", 1); // trust first proxy

// passport middleware config for authentication
passportConfig(app);

// Routes
app.use("/v1/auth", authRoutes);
app.use("/v1/refresh", refreshRoutes);
app.use("/v1/messages", messagesRoutes);
app.use("/v1/analytics", analyticsRoutes);
app.use("/v1/feed", publicFeedRoute);
app.use("/v1/adverts", advertRoutes);

app.use(protect);
app.use("/v1/users", userRoutes);
app.use("/v1/partners", partnerRoutes);
app.use("/v1/content", editorRoutes);
app.use("/v1/upload", uploadRoute);
app.use("/v1/notifications", notificationsRoutes);
app.use("/v1/support", supportRoutes);

// UnKnown Routes
app.all("*", (req: Request, _res: Response, next: NextFunction) => {
  const err = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(err);
});

// Global Error Handler
app.use(ErrorHandler.handle() as express.ErrorRequestHandler);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
