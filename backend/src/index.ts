import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { noteRoutes } from "./routes/noteRoutes";
import { transcribeRoutes } from "./routes/transcribeRoutes";
import { userRoutes } from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

// Configure CORS with more specific options
const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "https://whisprnotes.vercel.app",
    ];

    const isAllowed =
      allowedOrigins.includes(origin || "") ||
      /\.vercel\.app$/.test(origin || "");

    if (isAllowed || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
};


// Apply CORS middleware with options
app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/notes", noteRoutes);
app.use("/transcribe", transcribeRoutes);
app.use("/users", userRoutes);

// Add OPTIONS handler for preflight requests
app.options("*", cors(corsOptions));

app.use(errorHandler); // Global error handling middleware

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
