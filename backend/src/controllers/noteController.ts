import { Request, Response } from "express";
import { Note } from "../models/noteModel";
import {
  classifyIntent,
  generateContent,
  trimCommand,
  generateQueryResponse,
  semanticEditNotes,
  generateTitle,
} from "../services/aiService";

/**
 * Note controller that saves a note to the postgres database
 * @param req
 * @param res
 */
export const createNoteController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, content, user_id } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: "Title and content are required" });
    return;
  }

  try {
    const note = new Note(title, content, user_id);
    console.log("note: ", note);
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
export const updateNoteController = async (
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
    const existingNote = await Note.findById(Number(id));
    if (!existingNote) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

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
export const getNotesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const id = req.params.id as string;

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      res.status(400).json({ error: "Invalid pagination parameters" });
      return;
    }

    const notes = await Note.findPaginated(page, limit, id);
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
export const getNoteByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const note = await Note.findById(parseInt(id));

    if (!note) {
      res.status(404).json({ error: "Note not found or not authorized" });
      return;
    }

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
export const searchNotesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { query } = req.query;
  const user_id = req.query.user_id as string;

  if (!query || typeof query !== "string") {
    console.log("Invalid query - returning all notes");
    const allNotes = await Note.findPaginated(1, 10, user_id);
    res.json(allNotes);
    return;
  }

  const notes = await Note.searchByKeyword(query, user_id);
  res.json(notes);
};

/**
 * Note controller that determines what crud actions to take based on the query that's passed in.
 * @param req
 * @param res
 */
export const semanticQueryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query, user_id } = req.body;
    let notes: Note[] = [];
    let editedNotes: Note[] = [];

    if (!query || typeof query !== "string" || query.trim() === "") {
      notes = await Note.findPaginated(1, 20, user_id);
      res.json({
        notes,
        message: "I didn't hear anything, so I returned all your notes.",
      });
      return;
    }

    const intent = await classifyIntent(query);
    if (intent === "show_all") {
      notes = await Note.findPaginated(1, 20, user_id);
    } else if (intent === "create_note") {
      const trimmedQuery = await trimCommand(query);
      await createNoteFromBackend(trimmedQuery, user_id);
      notes = await Note.findPaginated(1, 20, user_id);
    } else if (intent === "request") {
      const newContent = await generateContent(query);
      await createNoteFromBackend(newContent, user_id);
      notes = await Note.findPaginated(1, 20, user_id);
    } else if (intent === "delete_all") {
      // Get all user's notes for deletion
      notes = await Note.findPaginated(1, 100, user_id); // Fetch up to 100 notes
    } else if (
      intent === "delete_notes" ||
      intent === "search" ||
      intent === "edit_notes"
    ) {
      // For deletion or editing, strip out command words to focus on relevant keywords
      const searchQuery =
        intent === "delete_notes" || intent === "edit_notes"
          ? await trimCommand(query)
          : query;
      notes = await Note.searchByEmbedding(searchQuery, user_id);
      if (intent === "edit_notes") {
        editedNotes = await semanticEditNotes(query, notes);
      }
    }
    const summaryMessage = await generateQueryResponse(query, intent, notes);

    res.json({
      notes,
      editedNotes,
      intent,
      message: summaryMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error performing semantic search" });
  }
};

/**
 *
 * @param content
 * @returns
 */
export async function createNoteFromBackend(content: string, user_id: string) {
  let title = await generateTitle(content);

  // Fallback if title generation fails
  if (!title || title.trim() === "") {
    title = content.split(" ").slice(0, 7).join(" ") + "...";
  }

  try {
    const note = new Note(title, content, user_id);
    const savedNote = await note.save();
    return savedNote;
  } catch (error) {
    console.error("Error creating note:", error);
    throw new Error("Failed to create note");
  }
}

/**
 * Note controller that deletes a note from the postgres database based on the id
 * in the request parameter.
 * @param req
 * @param res
 */
export const deleteNoteByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const user_id = (req.query.user_id as string) || (req.body.user_id as string);

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "Invalid note ID" });
    return;
  }

  try {
    const existingNote = await Note.findById(Number(id));
    if (!existingNote) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

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

/**
 * Note controller that deletes an array of note IDs passed as a query parameter.
 * @param req
 * @param res
 */
export const deleteNotesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { noteIds, user_id } = req.body;

  if (!Array.isArray(noteIds) || noteIds.length === 0) {
    res
      .status(400)
      .json({ error: "Invalid note IDs: must be a non-empty array" });
    return;
  }

  if (user_id) {
    for (const id of noteIds) {
      const note = await Note.findById(id);
      if (!note) {
        res.status(403).json({
          error:
            "You do not have permission to delete one or more of these notes",
        });
        return;
      }
    }
  }

  try {
    const deletedCount = await Note.deleteNotesByIds(noteIds);

    if (deletedCount && deletedCount > 0) {
      res
        .status(200)
        .json({ message: `${deletedCount} note(s) deleted successfully` });
    } else {
      res.status(404).json({ error: "No notes found for deletion" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting notes" });
  }
};

/**
 * Updates multiple notes in a single request.
 * @param req Request containing array of notes to update
 * @param res Response with updated notes
 */
export const updateNotesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { notes, user_id } = req.body;

  if (!Array.isArray(notes) || notes.length === 0) {
    res.status(400).json({ error: "Notes array must not be empty" });
    return;
  }

  if (user_id) {
    for (const note of notes) {
      if (!note.id) continue;

      const existingNote = await Note.findById(note.id);
      if (!existingNote) {
        res.status(403).json({
          error:
            "You do not have permission to update one or more of these notes",
        });
        return;
      }
    }
  }

  try {
    const updatedNotes = [];

    for (const note of notes) {
      if (!note.id || !note.title || !note.content) {
        continue;
      }

      const updatedNote = await Note.updateNoteById(
        note.id,
        note.title,
        note.content
      );

      if (updatedNote) {
        updatedNotes.push(updatedNote);
      }
    }

    if (updatedNotes.length > 0) {
      res.status(200).json({
        notes: updatedNotes,
        message: `${updatedNotes.length} note(s) updated successfully`,
      });
    } else {
      res.status(404).json({ error: "No notes were updated" });
    }
  } catch (err) {
    console.error("Error updating multiple notes:", err);
    res.status(500).json({ error: "Error updating notes" });
  }
};
