import { Request, Response } from "express";
import { Note } from "../models/noteModel";

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
    console.log(note);
    console.log('now to save it');
    const savedNote = await note.save();
    console.log(savedNote);
    res.json(savedNote);
  } catch (err) {
    console.log(err);
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

//Does a keyword search for now.
export const searchNotes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.body;
    console.log("query: ",query);
    console.log("typeof query: ", typeof query);

    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Query parameter is required" });
      return;
    }

    
    const notes = await Note.searchByKeyword(query);
    console.log("Keyword Search Results: ", notes);
    
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Error searching notes" });
  }
};
