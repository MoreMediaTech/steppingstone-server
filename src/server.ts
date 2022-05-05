import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as authRoutes }  from "./routes/authRoutes";
import { router as userRoutes } from "./routes/userRoutes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  "http://localhost:3000",
  "https://steppingstonesapp.com/",
];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(options));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// UnKnown Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});


app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});

