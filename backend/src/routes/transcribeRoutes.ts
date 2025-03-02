import express from "express";
import multer from "multer";
import { transcribeAudioFile } from "../controllers/transcribeController";

const upload = multer({
    dest: "uploads/",
    fileFilter: (req, file, cb) => {
        // Only accept audio files
        if (file.mimetype.startsWith("audio/")) {
            cb(null, true);  // Accept the file
        } else {
            console.log("Not an audio file");
            cb(null, false);  // Reject the file with the error
        }
    },
});

const router = express.Router();

router.post("/", upload.single("audio"), (req, res) => { 
    transcribeAudioFile(req, res);
});

export { router as transcribeRoutes };
