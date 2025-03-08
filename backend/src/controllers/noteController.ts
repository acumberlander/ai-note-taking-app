import { Request, Response } from "express";
import { Note } from "../models/noteModel";
import { classifyIntent, generateSearchResponse } from "../services/aiService";

/**
 * Note controller that saves a note to the postgres database
 * @param req
 * @param res
 */
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
    const note = new Note(title, content);
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating note" });
  }
};

/**
 * Note controller that updates a note in the database.
 * @param req
 * @param res
 */
export const updateNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "Invalid note ID" });
    return;
  }

  if (!title || !content) {
    res.status(400).json({ error: "Title and content are required" });
    return;
  }

  try {
    const updatedNote = await Note.updateNoteById(Number(id), title, content);

    if (!updatedNote) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    res.status(200).json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating note" });
  }
};

/**
 * Note controller that fetches all the notes from the postgres database
 * @param req
 * @param res
 */
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
    res.status(500).json({ error: "Error fetching notes", err });
  }
};

/**
 * Note controller that fetches a note from the postgres database based on the id passed in.
 * @param req
 * @param res
 */
export const getNoteById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const note = await Note.findById(parseInt(id));
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Error fetching note by id", err });
  }
};

/**
 * Note controller that fetches all the notes from the postgres database that match
 * the keywords of the query in the request body.
 * @param req
 * @param res
 */
// Exact keyword search (used for typed search box)
export const searchNotes = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    console.log("Invalid query - returning all notes");
    const allNotes = await Note.findPaginated(1, 10);
    res.json(allNotes);
    return;
  }

  const notes = await Note.searchByKeyword(query);
  res.json(notes);
};

/**
 * Note controller that fetches all the notes from the postgres database that match
 * the query based on the semantics.
 * @param req
 * @param res
 */
// Semantic search (used for voice search)
export const semanticSearchNotes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string" || query.trim() === "") {
      const notes = await Note.findPaginated(1, 10);
      res.json({
        notes,
        message: "I didn't hear anything, so I returned all your notes.",
      });
      return;
    }

    const intent = await classifyIntent(query);
    if (intent === "show_all") {
      const notes = await Note.findPaginated(1, 10);
      res.json({
        notes,
        message: "Here are all your notes.",
      });
      return;
    }

    const notes = await Note.searchByEmbedding(query);
    const summaryMessage = await generateSearchResponse(query, notes);

    res.json({
      notes,
      message: summaryMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error performing semantic search" });
  }
};

/**
 * Note controller that deletes a note from the postgres database based on the id
 * in the request parameter.
 * @param req
 * @param res
 */
export const deleteNoteById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "Invalid note ID" });
    return;
  }

  try {
    const deleted = await Note.deleteNoteById(Number(id));

    if (deleted) {
      res.status(200).json({ message: "Note deleted successfully" });
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting note" });
  }
};
