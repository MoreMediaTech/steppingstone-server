import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as authRoutes } from "./routes/authRoutes";
import { router as userRoutes } from "./routes/userRoutes";
import { router as partnerRoutes } from "./routes/partnerRoutes";
import { router as refreshRoutes } from "./routes/refreshTokenRoutes";
import { router as emailRoutes } from "./routes/emailRoutes";
import { protect } from "./middleware/authMiddleware";
import { credentials } from "./middleware/credentials";
import { corsOptions } from "./config/corsOptions";
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


app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Stepping Stones API</h1>");
})

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/refresh", refreshRoutes);
app.use("/api/v1/email", emailRoutes);

app.use(protect)
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/partners", partnerRoutes);

// UnKnown Routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
