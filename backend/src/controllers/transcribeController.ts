import { Request, Response } from "express";
import fs from "fs";
import { OpenAI } from "openai";

const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: openaiApiKey });

export const transcribeAudioFile = async (req: Request, res: Response): Promise<void> => {

    if (!req.file) {
        res.status(400).json({ error: "No audio file uploaded." });
        return; 
    }

    // Check if req.file.path exists and is a valid string
    if (!req.file.path || typeof req.file.path !== "string") {
        res.status(400).json({ error: "Invalid file path." });
        return;
    }
  
    const fileExtension = req.file.mimetype.split("/")[1];  // e.g., "mpeg" or "wav"
    const newFileName = `${req.file.path}.${fileExtension}`;
    const originalPath = req.file.path;
    const newFilePath = newFileName;

    // Rename the file to the correct extension (e.g., .wav)
    fs.renameSync(originalPath, newFilePath);
  
    try {
        const fileStream = fs.createReadStream(newFilePath);
        fileStream.path = newFilePath;

        //Sending file to OpenAI
        const transcription = await openai.audio.transcriptions.create({
            file: fileStream,
            model: "whisper-1",
        });

        fs.unlinkSync(newFilePath); // Delete the uploaded file after processing
        res.json({ text: transcription.text });

    } catch (error: any) {
        console.error("Transcription Error:", error);
        res.status(500).json({
            error: "Transcription failed. Please try again.",
            details: error.message || "Unknown error",
        });
    }
};
