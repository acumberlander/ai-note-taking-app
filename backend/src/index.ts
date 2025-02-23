import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { noteRoutes } from "./routes/noteRoutes";
import { transcribeRoutes } from "./routes/transcribeRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/notes", noteRoutes);
app.use("/api/transcribe", transcribeRoutes);

app.use(errorHandler); // Global error handling middleware

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
