import { Request, Response } from "express";
import { transcribeAudio } from "../services/transcribeService";

export const transcribeAudioFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const transcript = await transcribeAudio(req.file.path);
    res.json({ transcript });
  } catch (err) {
    res.status(500).json({ error: "Error transcribing audio" });
  }
};
