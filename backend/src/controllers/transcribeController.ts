import { Request, Response } from "express";
import { transcribeAudio } from "../services/transcribeService";

export const transcribeAudioFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  try {
    const fileUrl = `s3://transcription-audio-4f7a2d1c-3e8f-4b5a-9c6d-0e9f8a7b6c5d/${req.file.filename}`;
    const transcriptUrl = await transcribeAudio(fileUrl);

    if (!transcriptUrl) {
      res.status(500).json({ error: "Transcription job failed" });
      return;
    }

    res.json({ transcriptUrl });
    return;
  } catch (err) {
    res.status(500).json({ error: "Error transcribing audio" });
    return;
  }
};
