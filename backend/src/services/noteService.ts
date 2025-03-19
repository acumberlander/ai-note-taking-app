import { Note } from "../models/noteModel";
import { generateTitle } from "./aiService";

/**
 * Creates a new note with the given content and user ID.
 * Generates a title if one is not provided.
 */
export async function createNote(
  content: string,
  user_id: string | null,
  providedTitle?: string
): Promise<Note> {
  if (!content) {
    throw new Error("Content is required");
  }

  let title = providedTitle;

  // Generate title if not provided
  if (!title) {
    title = await generateTitle(content);

    // Fallback if title generation fails
    if (!title || title.trim() === "") {
      title = content.split(" ").slice(0, 7).join(" ") + "...";
    }
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
