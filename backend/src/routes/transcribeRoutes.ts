import express from "express";
import multer from "multer";
import { transcribeAudioFile } from "../controllers/transcribeController";

// Use memory storage instead of disk storage for better security
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only accept audio files
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true); // Accept the file
    } else {
      console.log("Not an audio file");
      cb(null, false); // Reject the file
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  },
});

const router = express.Router();

router.post("/", upload.single("audio"), (req, res) => {
  transcribeAudioFile(req, res);
});

export { router as transcribeRoutes };
