"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribeAudioFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const openai_1 = require("openai");
const os_1 = __importDefault(require("os"));
const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const transcribeAudioFile = async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: "No audio file uploaded." });
        return;
    }
    const validMimeTypes = ["audio/wav", "audio/mpeg", "audio/mp4", "audio/webm"];
    if (!validMimeTypes.includes(req.file.mimetype)) {
        res.status(400).json({ error: "Invalid audio format" });
        return;
    }
    // Create a temporary file in the OS temp directory
    const tempFilePath = path_1.default.join(os_1.default.tmpdir(), `${(0, uuid_1.v4)()}.wav`);
    try {
        // Write the buffer to a temporary file
        fs_1.default.writeFileSync(tempFilePath, req.file.buffer);
        const fileStream = fs_1.default.createReadStream(tempFilePath);
        fileStream.path = tempFilePath;
        const transcription = await openai.audio.transcriptions.create({
            file: fileStream,
            model: "whisper-1",
            language: "en",
        });
        // Delete the temporary file immediately
        fs_1.default.unlinkSync(tempFilePath);
        const transcriptionText = transcription.text?.trim().toLowerCase();
        const noiseWords = ["you", "uh", "ah", "hmm", "um"];
        if (!transcriptionText || noiseWords.includes(transcriptionText)) {
            res.json({ text: "" });
        }
        else {
            res.json({ text: transcription.text });
        }
    }
    catch (error) {
        // Ensure temporary file is deleted even if transcription fails
        if (fs_1.default.existsSync(tempFilePath)) {
            fs_1.default.unlinkSync(tempFilePath);
        }
        console.error("Transcription Error:", error);
        res.status(500).json({
            error: "Transcription failed. Please try again.",
            details: error.message || "Unknown error",
        });
    }
};
exports.transcribeAudioFile = transcribeAudioFile;
