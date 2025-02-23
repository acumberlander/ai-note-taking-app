import { Request, Response } from "express";
import { pool } from "../db";
import { generateEmbedding } from "../services/aiService";

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    // Generate AI embedding for search
    const embedding = await generateEmbedding(content);

    const result = await pool.query(
      "INSERT INTO notes (title, content, embedding) VALUES ($1, $2, $3) RETURNING *",
      [title, content, embedding]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error creating note" });
  }
};

export const getNotes = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM notes");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching notes" });
  }
};

// AI-powered search
export const searchNotes = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const embedding = await generateEmbedding(query as string);

    const result = await pool.query(
      "SELECT * FROM notes ORDER BY embedding <-> $1 LIMIT 5",
      [embedding]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error searching notes" });
  }
};
