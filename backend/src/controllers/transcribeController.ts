import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { OpenAI } from "openai";
import os from "os";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const transcribeAudioFile = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  const tempFilePath = path.join(os.tmpdir(), `${uuidv4()}.wav`);

  try {
    // Write the buffer to a temporary file
    fs.writeFileSync(tempFilePath, req.file.buffer);

    const fileStream = fs.createReadStream(tempFilePath);
    fileStream.path = tempFilePath;

    const transcription = await openai.audio.transcriptions.create({
      file: fileStream,
      model: "whisper-1",
      language: "en",
    });

    // Delete the temporary file immediately
    fs.unlinkSync(tempFilePath);

    const transcriptionText = transcription.text?.trim().toLowerCase();

    const noiseWords = ["you", "uh", "ah", "hmm", "um"];
    if (!transcriptionText || noiseWords.includes(transcriptionText)) {
      res.json({ text: "" });
    } else {
      res.json({ text: transcription.text });
    }
  } catch (error: any) {
    // Ensure temporary file is deleted even if transcription fails
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    console.error("Transcription Error:", error);
    res.status(500).json({
      error: "Transcription failed. Please try again.",
      details: error.message || "Unknown error",
    });
  }
};
