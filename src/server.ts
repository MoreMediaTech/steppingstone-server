import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
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
dotenv.config();

export const app: Application = express();
const PORT = process.env.PORT || 5001;
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


app.get("/api", (req: Request, res: Response) => {
  res.send("<h1>Stepping Stones API</h1>");
})

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
app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
