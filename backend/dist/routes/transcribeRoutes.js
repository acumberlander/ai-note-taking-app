"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const transcribeController_1 = require("../controllers/transcribeController");
// Use memory storage instead of disk storage for better security
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Only accept audio files
        if (file.mimetype.startsWith("audio/")) {
            cb(null, true); // Accept the file
        }
        else {
            console.log("Not an audio file");
            cb(null, false); // Reject the file
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
    },
});
const router = express_1.default.Router();
exports.transcribeRoutes = router;
router.post("/", upload.single("audio"), (req, res) => {
    (0, transcribeController_1.transcribeAudioFile)(req, res);
});
