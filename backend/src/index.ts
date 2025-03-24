import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { noteRoutes } from "./routes/noteRoutes";
import { transcribeRoutes } from "./routes/transcribeRoutes";
import { userRoutes } from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cors());
app.use(express.json());

// Removed the uploads directory creation code

app.use("/notes", noteRoutes);
app.use("/transcribe", transcribeRoutes);
app.use("/users", userRoutes);

app.use(errorHandler); // Global error handling middleware

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
