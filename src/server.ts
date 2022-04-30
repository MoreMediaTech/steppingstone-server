import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router as authRoutes }  from "./routes/authRoutes";
import { router as userRoutes } from "./routes/userRoutes";
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

const allowedOrigins = ["http://localhost:3000"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
}

app.use(cors(options));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});

