import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { router as authRoutes } from "./routes/authRoutes";
import { router as userRoutes } from "./routes/userRoutes";
import { router as partnerRoutes } from "./routes/partnerRoutes";
import { router as refreshRoutes } from "./routes/refreshTokenRoutes";
import { router as emailRoutes } from "./routes/emailRoutes";
import { router as editorRoutes } from "./routes/editorRoutes";
import { router as uploadRoute } from "./routes/uploadRoute";
import { protect } from "./middleware/authMiddleware";
import { credentials } from "./middleware/credentials";
import { corsOptions } from "./config/corsOptions";
import { ApiError } from "./middleware/apiErrorMiddleware";
import { logger } from "./middleware/logger";
import ErrorHandler from "./middleware/apiErrorMiddleware";

dotenv.config();

export const app: Application = express();
const PORT = process.env.PORT || 5001;

// Log all error events to file
app.use(logger)

// node version 16.15.1
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirements
app.use(credentials)

// Cross origin resource sharing
app.use(cors(corsOptions));

// middleware for parsing cookies
app.use(cookieParser());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// express middleware for parsing json
app.use(express.json({ limit: "50mb" }));

app.use("/api", express.static(path.join(__dirname, "public")));

app.get("/api", require("./routes/root"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/refresh", refreshRoutes);
app.use("/api/v1/email", emailRoutes);

app.use(protect)
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/partners", partnerRoutes);
app.use("/api/v1/editor", editorRoutes);
app.use("/api/v1/upload", uploadRoute);

// UnKnown Routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(err);
});

// Global Error Handler
app.use(ErrorHandler.handle());

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
