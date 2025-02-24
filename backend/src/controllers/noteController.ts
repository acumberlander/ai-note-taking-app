import { Request, Response } from "express";
import { Note } from "../models/noteModel";
import { generateEmbedding } from "../services/aiService";

export const createNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: "Title and content are required" });
    return;
  }

  try {
    const embedding = await generateEmbedding(content);

    const note = new Note(title, content, embedding);
    const savedNote = await note.save();

    res.json(savedNote);
  } catch (err) {
    res.status(500).json({ error: "Error creating note" });
  }
};

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      res.status(400).json({ error: "Invalid pagination parameters" });
      return;
    }

    const notes = await Note.findPaginated(page, limit);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching notes" });
  }
};

export const searchNotes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Query parameter is required" });
      return;
    }

    const embedding = await generateEmbedding(query);
    const notes = await Note.searchByEmbedding(embedding);

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Error searching notes" });
  }
};
