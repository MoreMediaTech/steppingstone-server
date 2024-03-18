import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ObjectId } from "bson";
import cookieParser from "cookie-parser";
import path from "path";
import session, { SessionOptions } from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

// Routes
import { appRouterConfig } from "./v1/routes";
import { mobileRouterConfig } from "./v1/mobile-routes";

// Middleware
import { credentials } from "./middleware/credentials";
import { corsOptions } from "./config/corsOptions";
import { ApiError } from "./middleware/apiErrorMiddleware";
import { logger } from "./middleware/logger";
import ErrorHandler from "./middleware/apiErrorMiddleware";

// config
import prisma from "./client";
import { passportConfig } from "./config/passportConfig";

// passport strategies
import "./strategies/passport-strategies";
import "./strategies/passport-jwt-strategies";

dotenv.config();

export const app: Application = express();

const sessionId = new ObjectId().toString();
const sess: SessionOptions = {
  genid(_req: Request) {
    return sessionId; // use UUIDs for session IDs
  },
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  name: "connect.sid",
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "production",
    maxAge: 60000 * 60 * 24,
    sameSite: false,
  },
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
};

// Set trust proxy to true to allow secure cookies over https
app.set("trust proxy", 1);

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

// passport middleware config for authentication
passportConfig(app);

// Routes
// express router for frontend app routes
appRouterConfig(app);

// express router for mobile app routes
mobileRouterConfig(app);

// UnKnown Routes
app.all("*", (req: Request, _res: Response, next: NextFunction) => {
  const err = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(err);
});

// Global Error Handler
app.use(ErrorHandler.handle() as express.ErrorRequestHandler);

export default app;
