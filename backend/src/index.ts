import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { noteRoutes } from "./routes/noteRoutes";
import { transcribeRoutes } from "./routes/transcribeRoutes";
import { userRoutes } from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/api/notes", noteRoutes);
app.use("/api/transcribe", transcribeRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler); // Global error handling middleware

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
