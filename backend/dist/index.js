"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const noteRoutes_1 = require("./routes/noteRoutes");
const transcribeRoutes_1 = require("./routes/transcribeRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Removed the uploads directory creation code
app.use("/api/notes", noteRoutes_1.noteRoutes);
app.use("/api/transcribe", transcribeRoutes_1.transcribeRoutes);
app.use("/api/users", userRoutes_1.userRoutes);
app.use(errorHandler_1.errorHandler); // Global error handling middleware
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
