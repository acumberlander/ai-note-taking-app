import { Request, Response } from "express";
import fs from "fs";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const transcribeAudioFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No audio file uploaded." });
    return;
  }

  if (!req.file.path || typeof req.file.path !== "string") {
    res.status(400).json({ error: "Invalid file path." });
    return;
  }

  const validMimeTypes = ["audio/wav", "audio/mpeg", "audio/mp4", "audio/webm"];
  if (!validMimeTypes.includes(req.file.mimetype)) {
    res.status(400).json({ error: "Invalid audio format" });
    return;
  }

  const fileExtension = req.file.mimetype.split("/")[1];
  const originalPath = req.file.path;
  const newFilePath = `${originalPath}.${fileExtension}`;

  fs.renameSync(originalPath, newFilePath);

  try {
    const fileStream = fs.createReadStream(newFilePath);
    fileStream.path = newFilePath;

    const transcription = await openai.audio.transcriptions.create({
      file: fileStream,
      model: "whisper-1",
      language: "en",
    });

    console.log("Transcription received:", transcription.text);

    fs.unlinkSync(newFilePath);

    res.json({ text: transcription.text });
  } catch (error: any) {
    console.error("Transcription Error:", error);
    res.status(500).json({
      error: "Transcription failed. Please try again.",
      details: error.message || "Unknown error",
    });
  }
};
