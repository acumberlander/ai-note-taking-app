import express from "express";
import multer from "multer";
import { transcribeAudioFile } from "../controllers/transcribeController";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/", upload.single("audio"), transcribeAudioFile);

export { router as transcribeRoutes };
